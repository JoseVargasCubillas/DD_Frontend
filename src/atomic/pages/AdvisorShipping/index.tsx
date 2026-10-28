import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyShipments,
  getPublicInfo,
  lookupPostalCode,
  submitPublicShipment,
  validatePublicShipment,
  type ShipmentDraft,
  type ShipmentStatus,
  type ShipmentValidation,
} from '@api/shipments.api';

const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
  'Guerrero', 'Hidalgo', 'Jalisco', 'Estado de México', 'Michoacán', 'Morelos',
  'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
  'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
  'Veracruz', 'Yucatán', 'Zacatecas',
];

const emptyDraft = (): ShipmentDraft => ({
  customer: { name: '', phone: '', email: '' },
  address: { street: '', colony: '', postalCode: '', city: '', state: '', references: '' },
  items: [{ slug: '', quantity: 1 }],
  notes: '',
});

const STATUS_LABEL: Record<ShipmentStatus, { text: string; cls: string }> = {
  pending: { text: 'Por aprobar', cls: 'bg-amber-100 text-amber-900' },
  processing: { text: 'Generando guía', cls: 'bg-sky-100 text-sky-900' },
  label_created: { text: 'Guía generada', cls: 'bg-emerald-100 text-emerald-900' },
  rejected: { text: 'Rechazado', cls: 'bg-red-100 text-red-900' },
  error: { text: 'En revisión', cls: 'bg-amber-100 text-amber-900' },
};

type Step = 'form' | 'review' | 'done';

type PostalState =
  | { status: 'idle' | 'loading' | 'not_found' | 'unavailable' }
  | { status: 'ok'; city: string; state: string; colonies: string[] };

export default function AdvisorShipping() {
  const { token = '' } = useParams<{ token: string }>();
  const qc = useQueryClient();
  const { data: info, isLoading, isError } = useQuery({
    queryKey: ['advisor-shipping', token],
    queryFn: () => getPublicInfo(token),
    retry: false,
  });
  const { data: mine = [] } = useQuery({
    queryKey: ['advisor-shipping-mine', token],
    queryFn: () => getMyShipments(token),
    enabled: Boolean(info),
    refetchInterval: 60_000,
  });

  const [draft, setDraft] = useState<ShipmentDraft>(emptyDraft);
  const [step, setStep] = useState<Step>('form');
  const [validation, setValidation] = useState<ShipmentValidation | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedDistinct, setConfirmedDistinct] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [postal, setPostal] = useState<PostalState>({ status: 'idle' });
  // Última ciudad puesta automáticamente: solo esa se puede sobrescribir al
  // cambiar de CP, para no pisar lo que el asesor escribió a mano.
  const autoCity = useRef('');
  const autoColony = useRef('');
  const draftRef = useRef(draft);
  draftRef.current = draft;

  // Autollenado por código postal (SEPOMEX vía Envia): estado, ciudad y colonias.
  const postalCode = draft.address.postalCode.replace(/\D/g, '');
  useEffect(() => {
    if (postalCode.length !== 5) {
      setPostal({ status: 'idle' });
      return;
    }
    let cancelled = false;
    setPostal({ status: 'loading' });
    lookupPostalCode(token, postalCode)
      .then((r) => {
        if (cancelled) return;
        if (!r.found || !r.state) {
          setPostal({ status: r.unavailable ? 'unavailable' : 'not_found' });
          return;
        }
        const colonies = r.colonies ?? [];
        const city = r.city ?? '';
        setPostal({ status: 'ok', city, state: r.state, colonies });
        // La decisión se toma fuera del updater de setDraft: React lo ejecuta
        // dos veces en desarrollo y no debe tener efectos secundarios.
        const current = draftRef.current.address;
        const replaceCity = !current.city.trim() || current.city === autoCity.current;
        if (replaceCity) autoCity.current = city;
        // Igual con la colonia: solo se reemplaza si está vacía o fue autollenada.
        const replaceColony = !current.colony.trim() || current.colony === autoColony.current;
        const colony = colonies.length === 1 ? colonies[0] : '';
        if (replaceColony) autoColony.current = colony;
        setDraft((d) => ({
          ...d,
          address: {
            ...d.address,
            state: r.state as string,
            city: replaceCity ? city : d.address.city,
            colony: replaceColony ? colony : d.address.colony,
          },
        }));
      })
      .catch(() => {
        if (!cancelled) setPostal({ status: 'unavailable' });
      });
    return () => {
      cancelled = true;
    };
  }, [postalCode, token]);

  // Link privado: que no aparezca en buscadores.
  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(robots);
    const prevTitle = document.title;
    document.title = 'Captura de envíos';
    return () => {
      document.head.removeChild(robots);
      document.title = prevTitle;
    };
  }, []);

  const validate = useMutation({
    mutationFn: () => validatePublicShipment(token, draft),
    onSuccess: (result) => {
      setValidation(result);
      setConfirmed(false);
      setConfirmedDistinct(false);
      setSubmitError('');
      if (!result.errors.length) {
        setStep('review');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStep('form');
      }
    },
  });

  const submit = useMutation({
    mutationFn: () => submitPublicShipment(token, draft, Boolean(validation?.duplicate)),
    onSuccess: () => {
      setStep('done');
      qc.invalidateQueries({ queryKey: ['advisor-shipping-mine', token] });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (e: Error) => {
      setSubmitError(e.message || 'No se pudo enviar. Revisa los datos e inténtalo de nuevo.');
      setStep('form');
      validate.mutate();
    },
  });

  const setCustomer = (k: keyof ShipmentDraft['customer'], v: string) =>
    setDraft((d) => ({ ...d, customer: { ...d.customer, [k]: v } }));
  const setAddress = (k: keyof ShipmentDraft['address'], v: string) =>
    setDraft((d) => ({ ...d, address: { ...d.address, [k]: v } }));
  const setItem = (i: number, patch: Partial<ShipmentDraft['items'][number]>) =>
    setDraft((d) => ({ ...d, items: d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));

  if (isLoading) return <Shell><p className="text-sm text-ink-500">Cargando…</p></Shell>;
  if (isError || !info) {
    // Respuesta genérica: no se revela si el link existió o fue desactivado.
    return (
      <Shell>
        <h1 className="font-serif text-3xl text-ink-900 mb-3">Link no disponible</h1>
        <p className="text-sm text-ink-600">Este link no existe o fue desactivado. Pide uno nuevo a administración.</p>
      </Shell>
    );
  }

  const bookTitle = (slug: string) => info.books.find((b) => b.slug === slug)?.title ?? slug;
  const duplicate = validation?.duplicate ?? null;
  const canSubmit = confirmed && (!duplicate || confirmedDistinct) && !submit.isPending;

  const reset = () => {
    setDraft(emptyDraft());
    setValidation(null);
    setStep('form');
    setConfirmed(false);
    setConfirmedDistinct(false);
    setSubmitError('');
  };

  return (
    <Shell>
      <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Envío de libros</p>
      <h1 className="font-serif text-3xl sm:text-4xl text-ink-900 leading-tight">Hola, {info.advisorName}</h1>
      <p className="text-sm text-ink-600 mt-2 mb-8 max-w-xl">
        Captura los datos del cliente. Antes de enviarlos revisamos que no falte nada y los verificas una última vez.
        Administración aprueba y genera la guía.
      </p>

      {step === 'done' && (
        <div className="border border-emerald-700/30 bg-emerald-50 p-6 mb-8">
          <p className="font-serif text-2xl text-ink-900 mb-2">Envío enviado a aprobación</p>
          <p className="text-sm text-ink-700 mb-4">
            Te avisaremos por WhatsApp cuando se genere la guía, o si hay algún dato que corregir.
          </p>
          <button type="button" onClick={reset} className="btn-broadsheet">Capturar otro envío</button>
        </div>
      )}

      {step === 'review' && validation && (
        <div className="space-y-5 mb-8">
          <div className="border border-ink-900/15 bg-cream-100 p-6">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-4">Revisa antes de enviar</p>
            <dl className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-2.5 text-sm">
              <Row k="Destinatario" v={draft.customer.name} />
              <Row k="Teléfono" v={draft.customer.phone} />
              {draft.customer.email && <Row k="Correo" v={draft.customer.email} />}
              <Row k="Calle y número" v={draft.address.street} />
              <Row k="Colonia" v={draft.address.colony} />
              <Row k="CP" v={draft.address.postalCode} />
              <Row k="Ciudad / Estado" v={`${draft.address.city}, ${draft.address.state}`} />
              {draft.address.references && <Row k="Referencias" v={draft.address.references} />}
              <Row
                k="Libros"
                v={draft.items.filter((i) => i.slug).map((i) => `${i.quantity}× ${bookTitle(i.slug)}`).join(' · ')}
              />
              {draft.notes && <Row k="Notas" v={draft.notes} />}
            </dl>
          </div>

          {validation.warnings.length > 0 && (
            <Notice tone="warn" title="Revisa estos puntos" items={validation.warnings} />
          )}

          {duplicate && (
            <div className="border border-amber-600/40 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-ink-900 mb-1">Ya hay un envío reciente para este teléfono</p>
              <p className="text-sm text-ink-700 mb-3">
                Se capturó el {new Date(duplicate.createdAt).toLocaleString('es-MX')}. Si es el mismo pedido,
                no lo envíes otra vez para no duplicar la guía.
              </p>
              <label className="flex items-start gap-2 text-sm text-ink-900 cursor-pointer">
                <input type="checkbox" checked={confirmedDistinct} onChange={(e) => setConfirmedDistinct(e.target.checked)} className="mt-1" />
                Es un pedido distinto, quiero enviarlo de todos modos.
              </label>
            </div>
          )}

          <label className="flex items-start gap-2 text-sm text-ink-900 cursor-pointer border border-ink-900/15 bg-cream-100 p-4">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
            Verifiqué por segunda vez el nombre, el teléfono, el código postal y el domicilio completo.
          </label>

          {submitError && <p className="text-sm text-red-700">{submitError}</p>}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep('form')} className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 px-5 py-3 cursor-pointer">
              Volver a editar
            </button>
            <button type="button" disabled={!canSubmit} onClick={() => submit.mutate()} className="btn-broadsheet disabled:opacity-50">
              {submit.isPending ? 'Enviando…' : 'Enviar a aprobación'}
            </button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            validate.mutate();
          }}
          className="space-y-8"
        >
          {validation && validation.errors.length > 0 && (
            <Notice tone="error" title="Corrige estos datos para continuar" items={validation.errors} />
          )}
          {submitError && !validation?.errors.length && <p className="text-sm text-red-700">{submitError}</p>}
          {validate.isError && (
            <p className="text-sm text-red-700">No se pudo validar. Revisa tu conexión e inténtalo de nuevo.</p>
          )}

          <Section title="Destinatario">
            <Field label="Nombre completo *">
              <input value={draft.customer.name} onChange={(e) => setCustomer('name', e.target.value)} className="ink-input" autoComplete="off" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Teléfono (10 dígitos) *">
                <input value={draft.customer.phone} onChange={(e) => setCustomer('phone', e.target.value)} inputMode="tel" className="ink-input" placeholder="5512345678" />
              </Field>
              <Field label="Correo (opcional)">
                <input value={draft.customer.email} onChange={(e) => setCustomer('email', e.target.value)} type="email" className="ink-input" />
              </Field>
            </div>
          </Section>

          <Section title="Domicilio de entrega">
            <Field label="Calle y número *">
              <input value={draft.address.street} onChange={(e) => setAddress('street', e.target.value)} className="ink-input" placeholder="Av. Reforma 123, Int. 4" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Código postal *">
                <input value={draft.address.postalCode} onChange={(e) => setAddress('postalCode', e.target.value)} inputMode="numeric" maxLength={5} className="ink-input" autoComplete="off" />
                <PostalHint postal={postal} />
              </Field>
              <Field label="Estado *">
                <select value={draft.address.state} onChange={(e) => setAddress('state', e.target.value)} className="ink-input cursor-pointer">
                  <option value="">Selecciona…</option>
                  {MEXICAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Ciudad / municipio *">
                <input value={draft.address.city} onChange={(e) => setAddress('city', e.target.value)} className="ink-input" />
              </Field>
              <Field label="Colonia *">
                <input
                  value={draft.address.colony}
                  onChange={(e) => setAddress('colony', e.target.value)}
                  list="advisor-colonies"
                  className="ink-input"
                  autoComplete="off"
                />
                {postal.status === 'ok' && postal.colonies.length > 0 && (
                  <datalist id="advisor-colonies">
                    {postal.colonies.map((c) => <option key={c} value={c} />)}
                  </datalist>
                )}
              </Field>
            </div>
            <Field label="Referencias (opcional)">
              <input value={draft.address.references} onChange={(e) => setAddress('references', e.target.value)} className="ink-input" placeholder="Entre calles, color de fachada, portón…" />
            </Field>
          </Section>

          <Section title="Libros">
            {draft.items.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_90px_auto] gap-3 items-end">
                <Field label={i === 0 ? 'Libro *' : ''}>
                  <select value={item.slug} onChange={(e) => setItem(i, { slug: e.target.value })} className="ink-input cursor-pointer">
                    <option value="">Selecciona…</option>
                    {info.books.map((b) => (
                      <option key={b.slug} value={b.slug}>{b.title}{b.inStock ? '' : ' (sin inventario)'}</option>
                    ))}
                  </select>
                </Field>
                <Field label={i === 0 ? 'Cantidad' : ''}>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={item.quantity}
                    onChange={(e) => setItem(i, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                    className="ink-input"
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, items: d.items.length > 1 ? d.items.filter((_, idx) => idx !== i) : d.items }))}
                  className="pb-2.5 text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-red-700 cursor-pointer"
                  aria-label="Quitar libro"
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDraft((d) => ({ ...d, items: [...d.items, { slug: '', quantity: 1 }] }))}
              className="text-[10px] uppercase tracking-[0.3em] text-ink-700 hover:text-ink-900 cursor-pointer"
            >
              + Agregar otro libro
            </button>
          </Section>

          <Section title="Notas para administración">
            <textarea value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} rows={2} className="ink-input" placeholder="Opcional" />
          </Section>

          <button type="submit" disabled={validate.isPending} className="btn-broadsheet disabled:opacity-50">
            {validate.isPending ? 'Revisando datos…' : 'Revisar datos'}
          </button>
        </form>
      )}

      {mine.length > 0 && (
        <section className="mt-14">
          <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-3">Mis envíos recientes</p>
          <ul className="border border-ink-900/15 bg-cream-100 divide-y divide-ink-900/10">
            {mine.map((s) => {
              const st = STATUS_LABEL[s.status];
              return (
                <li key={s._id} className="px-5 py-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-ink-900">{s.customerName}</p>
                    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] ${st.cls}`}>{st.text}</span>
                  </div>
                  <p className="text-ink-600 mt-1">{s.itemsTitle} · {s.destination}</p>
                  <p className="text-[11px] text-ink-500 mt-1">{new Date(s.createdAt).toLocaleString('es-MX')}</p>
                  {s.status === 'rejected' && s.rejectionReason && (
                    <p className="text-red-700 mt-1">Motivo: {s.rejectionReason}</p>
                  )}
                  {s.trackingNumber && (
                    <p className="text-ink-700 mt-1">
                      {s.carrier.toUpperCase()} · {s.trackingNumber}
                      {s.enviaStatus ? ` · ${s.enviaStatus}` : ''}
                      {s.trackUrl && (
                        <> · <a href={s.trackUrl} target="_blank" rel="noreferrer" className="underline">Rastrear</a></>
                      )}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink-900">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-14">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-1">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      {label && <span className="ink-label">{label}</span>}
      {children}
    </label>
  );
}

function PostalHint({ postal }: { postal: PostalState }) {
  if (postal.status === 'loading') return <span className="block text-xs text-ink-500 mt-1.5">Buscando código postal…</span>;
  if (postal.status === 'ok') {
    return (
      <span className="block text-xs text-emerald-800 mt-1.5">
        ✓ {postal.city}, {postal.state}
        {postal.colonies.length > 0 && ` · ${postal.colonies.length} colonia${postal.colonies.length === 1 ? '' : 's'}`}
      </span>
    );
  }
  if (postal.status === 'not_found') {
    return <span className="block text-xs text-red-700 mt-1.5">Este código postal no existe. Verifícalo con el cliente.</span>;
  }
  if (postal.status === 'unavailable') {
    return <span className="block text-xs text-ink-500 mt-1.5">No se pudo consultar el código postal; captura estado y ciudad a mano.</span>;
  }
  return <span className="block text-xs text-ink-500 mt-1.5">Al escribirlo se llenan estado, ciudad y colonias.</span>;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-[10px] uppercase tracking-[0.28em] text-ink-500 sm:pt-0.5">{k}</dt>
      <dd className="text-ink-900 break-words">{v}</dd>
    </>
  );
}

function Notice({ tone, title, items }: { tone: 'error' | 'warn'; title: string; items: string[] }) {
  const cls = tone === 'error' ? 'border-red-700/40 bg-red-50' : 'border-amber-600/40 bg-amber-50';
  return (
    <div className={`border p-5 ${cls}`} role={tone === 'error' ? 'alert' : undefined}>
      <p className="text-sm font-semibold text-ink-900 mb-2">{title}</p>
      <ul className="list-disc pl-5 space-y-1 text-sm text-ink-800">
        {items.map((m) => <li key={m}>{m}</li>)}
      </ul>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useAdvisors,
  useApproveShipment,
  useCreateAdvisor,
  useEditShipment,
  useRefreshAllTracking,
  useRefreshTracking,
  useRejectShipment,
  useRotateAdvisorToken,
  useShipmentQuotes,
  useShipments,
  useUpdateAdvisor,
} from '@hooks/useShipments';
import type { DeliveryState, Shipment, ShipmentAdvisor, ShipmentDraft, ShipmentStatus } from '@api/shipments.api';

const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
  'Guerrero', 'Hidalgo', 'Jalisco', 'Estado de México', 'Michoacán', 'Morelos',
  'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
  'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
  'Veracruz', 'Yucatán', 'Zacatecas',
];

const STATUS_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Por aprobar' },
  { key: 'label_created', label: 'Con guía' },
  { key: 'error', label: 'Con error / sin guía' },
  { key: 'rejected', label: 'Rechazados' },
];

const STATUS_PILL: Record<ShipmentStatus, { text: string; cls: string }> = {
  pending: { text: 'Por aprobar', cls: 'bg-amber-100 text-amber-900' },
  processing: { text: 'Generando…', cls: 'bg-sky-100 text-sky-900' },
  label_created: { text: 'Guía generada', cls: 'bg-emerald-100 text-emerald-900' },
  rejected: { text: 'Rechazado', cls: 'bg-red-100 text-red-900' },
  error: { text: 'Error', cls: 'bg-red-100 text-red-900' },
};

const DELIVERY_LABEL: Record<DeliveryState, string> = {
  unknown: 'Sin movimiento',
  in_transit: 'En tránsito',
  delivered: 'Entregado',
  incident: 'Incidencia',
};

const SOURCE_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Todos los orígenes' },
  { key: 'web', label: 'Compras web' },
  { key: 'advisor', label: 'Asesores' },
];

// Una compra web pagada que no pudo generar guía se muestra como "Sin guía",
// no como un "Error" genérico: el cliente ya pagó y falta resolverlo.
const statusPill = (s: Shipment) =>
  s.source === 'web' && s.status === 'error' ? { text: 'Sin guía', cls: 'bg-red-100 text-red-900' } : STATUS_PILL[s.status];

const SourceBadge = ({ s }: { s: Shipment }) =>
  s.source === 'web' ? (
    <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] bg-sky-100 text-sky-900">Web</span>
  ) : (
    <span className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] bg-violet-100 text-violet-900">Asesor</span>
  );

const fmtDateTime = (d?: string | null) => (d ? new Date(d).toLocaleString('es-MX') : '—');
const fmtMoney = (n?: number | null) => (n == null ? '—' : `$${Number(n).toLocaleString('es-MX', { maximumFractionDigits: 2 })}`);
const itemsText = (s: Shipment) => s.items.map((i) => `${i.quantity}× ${i.title}`).join(', ');

type Tab = 'shipments' | 'advisors';

export default function ManageShipments() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('tab') === 'advisores' ? 'advisors' : 'shipments';

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Ventas</p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-900 leading-none">Envíos de libros</h1>
        <p className="text-sm text-ink-600 mt-3 max-w-xl">
          Los asesores capturan el envío desde su link. Tú revisas, apruebas y se genera la guía en Envia.
        </p>
      </header>

      <div className="border-b border-ink-900/15 flex gap-7 mb-6">
        {([['shipments', 'Historial de guías'], ['advisors', 'Asesores y links']] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setParams(k === 'advisors' ? { tab: 'advisores' } : {})}
            className={`pb-3 -mb-px text-[11px] uppercase tracking-[0.32em] cursor-pointer border-b-2 whitespace-nowrap ${
              tab === k ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'shipments' ? <ShipmentsTab /> : <AdvisorsTab />}
    </div>
  );
}

// ── Historial ────────────────────────────────────────────────

function ShipmentsTab() {
  const [status, setStatus] = useState('all');
  const [source, setSource] = useState('all');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useShipments({ status, source, search: debounced, page });
  const refreshAll = useRefreshAllTracking();
  const open = useMemo(() => data?.items.find((s) => s._id === openId) ?? null, [data, openId]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {SOURCE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setSource(f.key); setPage(1); }}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] border cursor-pointer ${
              source === f.key ? 'bg-ink-900 text-cream border-ink-900' : 'border-ink-900/20 hover:border-ink-900'
            }`}
          >
            {f.label} <span className="opacity-60">{data?.sources?.[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setStatus(f.key); setPage(1); }}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] border cursor-pointer ${
              status === f.key ? 'bg-ink-900 text-cream border-ink-900' : 'border-ink-900/20 hover:border-ink-900'
            }`}
          >
            {f.label} <span className="opacity-60">{data?.counts[f.key] ?? 0}</span>
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => refreshAll.mutate()}
          disabled={refreshAll.isPending}
          className="text-[10px] uppercase tracking-[0.28em] border border-ink-900/20 hover:border-ink-900 px-3 py-2 cursor-pointer disabled:opacity-50"
        >
          {refreshAll.isPending ? 'Consultando…' : 'Actualizar rastreo'}
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por cliente, teléfono, asesor, guía, ciudad o CP…"
        className="ink-input"
      />

      <div className="border border-ink-900/15 bg-cream-100 overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[110px_1.3fr_1fr_130px_150px_120px] gap-4 px-5 py-3 border-b border-ink-900/15 text-[10px] uppercase tracking-[0.32em] text-ink-500">
            <span>Fecha</span><span>Cliente</span><span>Destino</span><span>Origen</span><span>Estatus</span><span>Guía</span>
          </div>
          {isLoading ? (
            <p className="p-8 text-sm text-ink-500">Cargando…</p>
          ) : !data?.items.length ? (
            <p className="p-12 text-center text-sm text-ink-500">No hay envíos con este filtro.</p>
          ) : (
            data.items.map((s) => {
              const pill = statusPill(s);
              return (
                <button
                  key={s._id}
                  onClick={() => setOpenId(s._id)}
                  className="grid grid-cols-[110px_1.3fr_1fr_130px_150px_120px] gap-4 px-5 py-3.5 border-b border-ink-900/10 last:border-0 items-center text-left w-full hover:bg-cream-200/60 cursor-pointer"
                >
                  <span className="text-xs text-ink-600">{new Date(s.createdAt).toLocaleDateString('es-MX')}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink-900 truncate">{s.customer.name}</span>
                    <span className="block text-xs text-ink-500 truncate">{itemsText(s)}</span>
                  </span>
                  <span className="text-xs text-ink-700 truncate">{s.address.city}, {s.address.state}</span>
                  <span className="min-w-0">
                    <SourceBadge s={s} />
                    {s.source === 'advisor' && <span className="block text-xs text-ink-700 truncate mt-1">{s.advisorName}</span>}
                  </span>
                  <span>
                    <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${pill.cls}`}>{pill.text}</span>
                    {s.status === 'label_created' && (
                      <span className="block text-[11px] text-ink-500 mt-1 truncate">
                        {s.enviaStatus || DELIVERY_LABEL[s.deliveryState]}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-ink-700 truncate">{s.trackingNumber || '—'}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {data && data.pages > 1 && (
        <div className="flex items-center justify-between text-xs text-ink-600">
          <span>Página {data.page} de {data.pages} · {data.total} envíos</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="border border-ink-900/20 px-3 py-1.5 disabled:opacity-40 cursor-pointer">Anterior</button>
            <button disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="border border-ink-900/20 px-3 py-1.5 disabled:opacity-40 cursor-pointer">Siguiente</button>
          </div>
        </div>
      )}

      {open && <ShipmentDetail shipment={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}

// ── Detalle / aprobación ─────────────────────────────────────

const toDraft = (s: Shipment): ShipmentDraft => ({
  customer: { ...s.customer },
  address: { ...s.address },
  items: s.items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
  notes: s.notes,
});

function ShipmentDetail({ shipment: s, onClose }: { shipment: Shipment; onClose: () => void }) {
  const actionable = s.status === 'pending' || s.status === 'error';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ShipmentDraft>(() => toDraft(s));
  const [rateKey, setRateKey] = useState('');
  const [reason, setReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const quotes = useShipmentQuotes(s._id, actionable && !editing);
  const edit = useEditShipment();
  const approve = useApproveShipment();
  const reject = useRejectShipment();
  const refresh = useRefreshTracking();

  const rates = quotes.data ?? [];
  const selectedRate = rates.find((r) => `${r.carrier}|${r.service}` === rateKey) ?? rates[0];
  const pill = statusPill(s);
  const isWeb = s.source === 'web';

  const setCustomer = (k: keyof ShipmentDraft['customer'], v: string) =>
    setDraft((d) => ({ ...d, customer: { ...d.customer, [k]: v } }));
  const setAddress = (k: keyof ShipmentDraft['address'], v: string) =>
    setDraft((d) => ({ ...d, address: { ...d.address, [k]: v } }));

  const doApprove = () => {
    if (!selectedRate) return;
    const msg = `Se generará la guía con ${selectedRate.carrierDescription} (${selectedRate.serviceDescription}) por ${fmtMoney(selectedRate.totalPrice)} que se descuentan de tu saldo de Envia.${
      isWeb ? ' Al terminar se avisará al cliente con su número de guía.' : ''
    } ¿Continuar?`;
    if (!confirm(msg)) return;
    approve.mutate({ id: s._id, choice: { carrier: selectedRate.carrier, service: selectedRate.service } }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-cream border border-ink-900/20 shadow-xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Envío #{s._id.slice(-6).toUpperCase()}</p>
            <h3 className="font-serif text-2xl text-ink-900">{s.customer.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <SourceBadge s={s} />
              <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${pill.cls}`}>{pill.text}</span>
              {isWeb && s.orderId && (
                <a href={`/recibo/pedido/${s.orderId}`} target="_blank" rel="noreferrer" className="text-xs text-ink-600 underline">
                  Pedido #{s.orderId.slice(-8).toUpperCase()}
                </a>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-2xl text-ink-700 cursor-pointer min-h-11 min-w-11" aria-label="Cerrar">×</button>
        </div>

        {s.error && (
          <div className="border border-red-700/40 bg-red-50 text-sm text-red-800 p-3 mb-4">
            <p>{isWeb ? 'El cliente ya pagó, pero no se pudo generar la guía' : 'Error al generar la guía'}: {s.error}</p>
            {isWeb && <p className="mt-1 text-xs text-red-700">Elige paquetería abajo y pulsa "Reintentar guía"; al terminar se avisa al cliente.</p>}
          </div>
        )}
        {s.status === 'rejected' && (
          <p className="border border-red-700/30 bg-red-50 text-sm text-red-800 p-3 mb-4">
            Rechazado por {s.reviewedBy || 'admin'} el {fmtDateTime(s.reviewedAt)}. Motivo: {s.rejectionReason}
          </p>
        )}
        {actionable && s.warnings.length > 0 && (
          <div className="border border-amber-600/40 bg-amber-50 p-3 mb-4 text-sm text-ink-800">
            <p className="font-semibold mb-1">Avisos detectados al capturar</p>
            <ul className="list-disc pl-5 space-y-0.5">{s.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        )}

        {editing ? (
          <form
            className="space-y-3 mb-5"
            onSubmit={(e) => {
              e.preventDefault();
              edit.mutate({ id: s._id, draft }, { onSuccess: () => setEditing(false) });
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Nombre" value={draft.customer.name} onChange={(v) => setCustomer('name', v)} />
              <Input label="Teléfono" value={draft.customer.phone} onChange={(v) => setCustomer('phone', v)} />
              <Input label="Calle y número" value={draft.address.street} onChange={(v) => setAddress('street', v)} />
              <Input label="Colonia" value={draft.address.colony} onChange={(v) => setAddress('colony', v)} />
              <Input label="CP" value={draft.address.postalCode} onChange={(v) => setAddress('postalCode', v)} />
              <Input label="Ciudad" value={draft.address.city} onChange={(v) => setAddress('city', v)} />
              <label className="block">
                <span className="ink-label">Estado</span>
                <select value={draft.address.state} onChange={(e) => setAddress('state', e.target.value)} className="ink-input cursor-pointer">
                  <option value="">Selecciona…</option>
                  {MEXICAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </label>
              <Input label="Referencias" value={draft.address.references} onChange={(v) => setAddress('references', v)} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { setDraft(toDraft(s)); setEditing(false); }} className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 px-4 py-2.5 cursor-pointer">Cancelar</button>
              <button type="submit" disabled={edit.isPending} className="btn-broadsheet disabled:opacity-50">{edit.isPending ? 'Guardando…' : 'Guardar cambios'}</button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-2.5 text-sm border border-ink-900/15 bg-cream-100 p-5 mb-5">
            <Row k="Origen" v={isWeb ? 'Compra web (pagada con tarjeta)' : `Asesor: ${s.advisorName}`} />
            <Row k="Teléfono" v={s.customer.phone} />
            {s.customer.email && <Row k="Correo" v={s.customer.email} />}
            <Row k="Domicilio" v={`${s.address.street}, ${s.address.colony}`} />
            <Row k="CP / Ciudad" v={`${s.address.postalCode} · ${s.address.city}, ${s.address.state}`} />
            {s.address.references && <Row k="Referencias" v={s.address.references} />}
            <Row k="Libros" v={itemsText(s)} />
            {s.notes && <Row k="Notas" v={s.notes} />}
            <Row k="Capturado" v={fmtDateTime(s.createdAt)} />
            {!isWeb && <Row k="Costo estimado" v={fmtMoney(s.quotedPrice)} />}
          </dl>
        )}

        {s.status === 'label_created' && (
          <div className="border border-ink-900/15 bg-cream-100 p-5 mb-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500">Guía y rastreo</p>
            <dl className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-2 text-sm">
              <Row k="Paquetería" v={`${s.carrier.toUpperCase()} · ${s.service}`} />
              <Row k="Número de guía" v={s.trackingNumber} />
              <Row k="Costo real" v={fmtMoney(s.shippingCost)} />
              <Row k="Estatus Envia" v={s.enviaStatus || DELIVERY_LABEL[s.deliveryState]} />
              <Row k="Última consulta" v={fmtDateTime(s.enviaCheckedAt)} />
              <Row k="Aprobado por" v={`${s.reviewedBy || '—'} · ${fmtDateTime(s.reviewedAt)}`} />
            </dl>
            <div className="flex flex-wrap gap-2">
              {s.labelUrl && <a href={s.labelUrl} target="_blank" rel="noreferrer" className="btn-broadsheet">Descargar guía (PDF)</a>}
              {s.trackUrl && <a href={s.trackUrl} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 px-4 py-2.5">Ver rastreo en la paquetería</a>}
              <button onClick={() => refresh.mutate(s._id)} disabled={refresh.isPending} className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 px-4 py-2.5 cursor-pointer disabled:opacity-50">
                {refresh.isPending ? 'Consultando…' : 'Actualizar estatus'}
              </button>
            </div>
            {s.enviaEvents.length > 0 && (
              <ul className="border-l-2 border-ink-900/20 pl-4 space-y-3 pt-2">
                {s.enviaEvents.map((ev, i) => (
                  <li key={i}>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-ink-500">{ev.date}{ev.location ? ` · ${ev.location}` : ''}</p>
                    <p className="text-sm text-ink-900">{ev.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {s.notifications.length > 0 && (
          <div className="border border-ink-900/15 bg-cream-100 p-4 mb-5">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-2">Avisos enviados</p>
            <ul className="space-y-1 text-sm">
              {s.notifications.map((line) => (
                <li key={line} className={/falló/.test(line) ? 'text-red-700' : /omitido/.test(line) ? 'text-amber-800' : 'text-emerald-800'}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {actionable && !editing && (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-2">Paquetería</p>
              {quotes.isLoading ? (
                <p className="text-sm text-ink-500">Cotizando…</p>
              ) : !rates.length ? (
                <p className="text-sm text-red-700">No hay cotizaciones para este destino. Edita los datos del domicilio o rechaza el envío.</p>
              ) : (
                <div className="space-y-2">
                  {rates.map((r) => {
                    const key = `${r.carrier}|${r.service}`;
                    const checked = (selectedRate ? `${selectedRate.carrier}|${selectedRate.service}` : '') === key;
                    return (
                      <label key={key} className={`flex items-center gap-3 p-3 cursor-pointer border ${checked ? 'border-ink-900 bg-cream-200' : 'border-ink-900/15 hover:bg-cream-200/60'}`}>
                        <input type="radio" name="rate" checked={checked} onChange={() => setRateKey(key)} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-ink-900">{r.carrierDescription} · {r.serviceDescription}</span>
                          <span className="block text-xs text-ink-500">{r.deliveryEstimate || '—'}</span>
                        </span>
                        <span className="font-serif text-lg text-ink-900">{fmtMoney(r.totalPrice)}</span>
                      </label>
                    );
                  })}
                  <p className="text-xs text-ink-500">Por defecto va la opción más barata.</p>
                </div>
              )}
            </div>

            {isWeb ? (
              <div className="flex flex-wrap gap-2">
                <button onClick={doApprove} disabled={approve.isPending || !selectedRate} className="btn-broadsheet disabled:opacity-50">
                  {approve.isPending ? 'Generando guía…' : 'Reintentar guía'}
                </button>
              </div>
            ) : rejecting ? (
              <div className="space-y-2">
                <label className="block">
                  <span className="ink-label">Motivo (se le envía al asesor por WhatsApp)</span>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="ink-input" placeholder="Ej. El CP no corresponde a la colonia" />
                </label>
                <div className="flex gap-2">
                  <button onClick={() => setRejecting(false)} className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 px-4 py-2.5 cursor-pointer">Cancelar</button>
                  <button
                    onClick={() => reject.mutate({ id: s._id, reason }, { onSuccess: onClose })}
                    disabled={reject.isPending || reason.trim().length < 3}
                    className="text-[10px] uppercase tracking-[0.3em] bg-red-700 text-white px-4 py-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {reject.isPending ? 'Rechazando…' : 'Confirmar rechazo'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button onClick={doApprove} disabled={approve.isPending || !selectedRate} className="btn-broadsheet disabled:opacity-50">
                  {approve.isPending ? 'Generando guía…' : 'Aprobar y generar guía'}
                </button>
                <button onClick={() => { setDraft(toDraft(s)); setEditing(true); }} className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 px-4 py-2.5 cursor-pointer">Editar datos</button>
                <button onClick={() => setRejecting(true)} className="text-[10px] uppercase tracking-[0.3em] border border-red-700/40 text-red-800 hover:bg-red-50 px-4 py-2.5 cursor-pointer">Rechazar</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Asesores ─────────────────────────────────────────────────

const linkFor = (a: ShipmentAdvisor) => `${window.location.origin}/envios-asesores/${a.token}`;

function AdvisorsTab() {
  const { data: advisors = [], isLoading } = useAdvisors();
  const create = useCreateAdvisor();
  const update = useUpdateAdvisor();
  const rotate = useRotateAdvisorToken();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const copy = async (a: ShipmentAdvisor) => {
    try {
      await navigator.clipboard.writeText(linkFor(a));
      toast.success(`Link de ${a.name} copiado`);
    } catch {
      window.prompt('Copia el link:', linkFor(a));
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate(
            { name: name.trim(), phone: phone.trim(), email: email.trim() },
            { onSuccess: () => { setName(''); setPhone(''); setEmail(''); } },
          );
        }}
        className="border border-ink-900/15 bg-cream-100 p-5 flex flex-wrap items-end gap-3"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="ink-label">Nombre del asesor</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="ink-input" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="ink-label">WhatsApp (avisos)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="ink-input" placeholder="5512345678" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="ink-label">Correo (avisos)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="ink-input" />
        </div>
        <button type="submit" disabled={create.isPending} className="btn-broadsheet disabled:opacity-50">
          {create.isPending ? 'Creando…' : '+ Asesor'}
        </button>
      </form>

      <p className="text-xs text-ink-500">
        Cada asesor tiene su propio link secreto. Si alguien deja el equipo, desactívalo; si un link se filtra,
        genera uno nuevo y el anterior deja de funcionar al instante.
      </p>

      <div className="border border-ink-900/15 bg-cream-100">
        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando…</p>
        ) : advisors.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-500">Aún no hay asesores.</p>
        ) : (
          advisors.map((a) => (
            <div key={a._id} className="px-5 py-4 border-b border-ink-900/10 last:border-0 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  defaultValue={a.name}
                  onBlur={(e) => { if (e.target.value.trim() && e.target.value !== a.name) update.mutate({ id: a._id, data: { name: e.target.value } }); }}
                  className="bg-transparent text-sm font-semibold text-ink-900 focus:outline-none border-b border-transparent focus:border-ink-900"
                />
                <input
                  defaultValue={a.phone}
                  placeholder="WhatsApp"
                  onBlur={(e) => { if (e.target.value !== a.phone) update.mutate({ id: a._id, data: { phone: e.target.value } }); }}
                  className="bg-transparent text-xs text-ink-700 focus:outline-none border-b border-transparent focus:border-ink-900 w-36"
                />
                <input
                  defaultValue={a.email}
                  placeholder="Correo"
                  onBlur={(e) => { if (e.target.value !== a.email) update.mutate({ id: a._id, data: { email: e.target.value } }); }}
                  className="bg-transparent text-xs text-ink-700 focus:outline-none border-b border-transparent focus:border-ink-900 w-48"
                />
                <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${a.isActive ? 'bg-emerald-100 text-emerald-900' : 'bg-ink-900/10 text-ink-600'}`}>
                  {a.isActive ? 'Activo' : 'Desactivado'}
                </span>
                <span className="text-xs text-ink-500 ml-auto">
                  {a.shipmentsCount} envíos · {a.pendingCount} por aprobar · último uso {a.lastUsedAt ? fmtDateTime(a.lastUsedAt) : 'nunca'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <code className="flex-1 min-w-[220px] truncate text-[11px] bg-cream-200 border border-ink-900/10 px-2 py-1.5 text-ink-700">{linkFor(a)}</code>
                <button onClick={() => copy(a)} className="text-[10px] uppercase tracking-[0.28em] border border-ink-900/20 hover:border-ink-900 px-3 py-2 cursor-pointer">Copiar link</button>
                <button onClick={() => update.mutate({ id: a._id, data: { isActive: !a.isActive } })} className="text-[10px] uppercase tracking-[0.28em] border border-ink-900/20 hover:border-ink-900 px-3 py-2 cursor-pointer">
                  {a.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => { if (confirm(`Se generará un link nuevo para ${a.name} y el actual dejará de funcionar. ¿Continuar?`)) rotate.mutate(a._id); }}
                  className="text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-red-700 px-3 py-2 cursor-pointer"
                >
                  Regenerar link
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Piezas ───────────────────────────────────────────────────

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-[10px] uppercase tracking-[0.28em] text-ink-500 sm:pt-0.5">{k}</dt>
      <dd className="text-ink-900 break-words">{v || '—'}</dd>
    </>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="ink-label">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="ink-input" />
    </label>
  );
}

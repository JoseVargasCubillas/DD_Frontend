import { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useUser, useUpdateUser, useSendPassword, useUpdateNotes, useAssignTag, useRemoveTag, useToggleUserActive } from '@hooks/useUsers';
import { useTags } from '@hooks/useTags';
import { usePackages, useAssignPackage } from '@hooks/usePackages';
import type { Course, Offer, Package, Tag } from '@t/index';

type TabKey = 'lifecycle' | 'info' | 'purchases' | 'products' | 'notes';
const TABS: { k: TabKey; label: string }[] = [
  { k: 'lifecycle', label: 'Ciclo de vida' },
  { k: 'info',      label: 'Información' },
  { k: 'purchases', label: 'Compras' },
  { k: 'products',  label: 'Productos' },
  { k: 'notes',     label: 'Notas' },
];

export default function ContactProfile() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contact, isLoading } = useUser(id);
  const { data: allTags = [] } = useTags();
  const { data: allPackages = [] } = usePackages();
  const [tab, setTab] = useState<TabKey>('lifecycle');
  const [editing, setEditing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showAssignSubscription, setShowAssignSubscription] = useState(false);

  if (isLoading) return <p className="text-sm text-ink-500">Cargando contacto…</p>;
  if (!contact) return <p className="text-sm text-ink-500">Contacto no encontrado.</p>;

  return (
    <div className="space-y-8">
      {/* Header / acciones */}
      <header>
        <Link to="/admin/contactos" className="text-[10px] uppercase tracking-[0.32em] text-ink-600 hover:text-ink-900">
          ← Contactos
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Expediente</p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">{contact.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2 relative">
            <button onClick={() => setEditing(true)} className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 px-4 py-2.5 cursor-pointer">
              Editar detalles
            </button>
            <button onClick={() => setShowAssignSubscription(true)} className="text-[10px] uppercase tracking-[0.3em] bg-ink-900 text-cream hover:bg-ink-800 px-4 py-2.5 cursor-pointer">
              + Asignar suscripción
            </button>
            <SendPasswordButton id={id} />
            <button onClick={() => setShowMore((s) => !s)} className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 px-4 py-2.5 cursor-pointer">
              Más acciones ▾
            </button>
            {showMore && <MoreActions id={id} isActive={contact.isActive} onAction={() => setShowMore(false)} onDeleted={() => navigate('/admin/contactos')} />}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* ── Columna principal ─────────────────── */}
        <section className="space-y-6">
          {/* Card cabecera contacto */}
          <div className="border border-ink-900/15 bg-cream-100 p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-3xl shrink-0">
              {contact.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-2xl text-ink-900 truncate">{contact.name}</h2>
              <p className="text-sm text-ink-600">{contact.email}</p>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px] uppercase tracking-[0.28em] text-ink-500">
                <p>Añadido <span className="text-ink-700 normal-case tracking-normal">{new Date(contact.createdAt).toLocaleDateString('es-MX')}</span></p>
                <p>Cliente desde <span className="text-ink-700 normal-case tracking-normal">{contact.contactStatus === 'customer' ? new Date(contact.createdAt).toLocaleDateString('es-MX') : '—'}</span></p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-ink-900/15 flex gap-7 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`pb-3 -mb-px text-[11px] uppercase tracking-[0.32em] cursor-pointer transition-colors border-b-2 whitespace-nowrap ${
                  tab === t.k ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'lifecycle' && <LifecycleTab contact={contact} />}
          {tab === 'info'      && <InfoTab contact={contact} />}
          {tab === 'purchases' && <PurchasesTab orders={contact.orders} />}
          {tab === 'products'  && <ProductsTab courses={contact.enrolledCourses as any} offers={(contact as any).assignedOffers ?? []} />}
          {tab === 'notes'     && <NotesTab id={id} initial={contact.notes ?? ''} />}
        </section>

        {/* ── Sidebar derecho ──────────────────── */}
        <aside className="space-y-6">
          <TagsCard userId={id} userTags={contact.tags} allTags={allTags} />
        </aside>
      </div>

      {editing && <EditModal id={id} contact={contact} onClose={() => setEditing(false)} />}
      {showAssignSubscription && (
        <AssignSubscriptionModal userId={id} packages={allPackages} onClose={() => setShowAssignSubscription(false)} />
      )}
    </div>
  );
}

const DURATION_OPTIONS: { days: number; label: string; sub: string }[] = [
  { days: 30,  label: '1 mes',   sub: '30 días de acceso' },
  { days: 90,  label: '90 días', sub: '3 meses de acceso' },
  { days: 365, label: '1 año',   sub: '365 días de acceso' },
];

function pickCanonicalPackage(packages: Package[]): Package | null {
  const active = packages.filter((p) => p.isActive);
  if (active.length === 0) return null;
  const tierRank: Record<string, number> = { master: 0, business: 1, entrepreneur: 2 };
  return [...active].sort(
    (a, b) => (tierRank[a.tier ?? ''] ?? 99) - (tierRank[b.tier ?? ''] ?? 99),
  )[0];
}

function AssignSubscriptionModal({
  userId,
  packages,
  onClose,
}: {
  userId: string;
  packages: Package[];
  onClose: () => void;
}) {
  const assign = useAssignPackage();
  const [durationDays, setDurationDays] = useState<number>(365);
  const canonical = useMemo(() => pickCanonicalPackage(packages), [packages]);

  const submit = () => {
    if (!canonical) return;
    assign.mutate(
      { userId, packageId: canonical._id, durationDays },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-6">
      <div
        className="w-full max-w-md bg-cream border border-ink-900/20 shadow-xl p-7"
        style={{ animation: 'paper-unfold 320ms ease-out both' }}
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Academia</p>
        <h3 className="font-serif text-2xl text-ink-900 mb-1">Asignar suscripción</h3>
        <p className="text-sm text-ink-600 mb-5">
          Otorga acceso a todos los cursos de la academia por el tiempo que elijas.
        </p>

        {!canonical ? (
          <div className="text-sm text-ink-500 border border-dashed border-ink-900/15 p-6 text-center mb-4">
            No hay un paquete de suscripción activo.{' '}
            <Link to="/admin/ventas/paquetes" className="underline">Crea uno aquí</Link>.
          </div>
        ) : (
          <>
            <div className="border border-ink-900/15 bg-cream-100 p-4 mb-5">
              <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-1">Paquete</p>
              <p className="font-serif text-lg text-ink-900">{canonical.name}</p>
              <p className="text-xs text-ink-500 mt-0.5">
                {canonical.courseIds.length} cursos incluidos
              </p>
            </div>

            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-2">Duración</p>
            <div className="space-y-2 mb-5">
              {DURATION_OPTIONS.map((opt) => (
                <label
                  key={opt.days}
                  className={`flex items-center gap-3 p-3 cursor-pointer border transition-colors ${
                    durationDays === opt.days
                      ? 'border-ink-900 bg-cream-200'
                      : 'border-ink-900/15 hover:bg-cream-200/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={opt.days}
                    checked={durationDays === opt.days}
                    onChange={() => setDurationDays(opt.days)}
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-ink-900">{opt.label}</p>
                    <p className="text-xs text-ink-500">{opt.sub}</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ink-500">{opt.days} días</p>
                </label>
              ))}
            </div>
          </>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 py-2.5 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={!canonical || assign.isPending}
            className="btn-broadsheet flex-1 disabled:opacity-50"
          >
            {assign.isPending ? 'Asignando…' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Subcomponentes ────────────────────────────────────────────
function SendPasswordButton({ id }: { id: string }) {
  const send = useSendPassword();
  return (
    <button
      onClick={() => send.mutate(id)}
      disabled={send.isPending}
      className="text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 px-4 py-2.5 cursor-pointer disabled:opacity-50"
    >
      {send.isPending ? 'Enviando…' : 'Enviar contraseña'}
    </button>
  );
}

function MoreActions({ id, isActive, onAction, onDeleted }: { id: string; isActive: boolean; onAction: () => void; onDeleted: () => void }) {
  const toggle = useToggleUserActive();
  return (
    <div className="absolute right-0 top-full mt-1 w-56 bg-cream border border-ink-900/20 shadow-lg z-30">
      <button
        onClick={() => { toggle.mutate(id); onAction(); }}
        className="block w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.28em] hover:bg-cream-200 cursor-pointer"
      >
        {isActive ? 'Desactivar' : 'Activar'} acceso
      </button>
      <button
        onClick={() => { onAction(); onDeleted(); }}
        className="block w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.28em] hover:bg-cream-200 cursor-pointer border-t border-ink-900/10"
      >
        Volver al listado
      </button>
    </div>
  );
}

function LifecycleTab({ contact }: { contact: any }) {
  const lifespanDays = Math.max(0, Math.round((Date.now() - new Date(contact.createdAt).getTime()) / 86400000));
  const purchases = contact.orders?.length ?? 0;
  const netRevenue = (contact.orders ?? []).reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Vigencia', value: `${lifespanDays} días` },
          { label: 'Compras', value: String(purchases) },
          { label: 'Ingresos netos', value: `$${netRevenue.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="border border-ink-900/15 bg-cream-100 p-5">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-2">{s.label}</p>
            <p className="font-serif text-3xl text-ink-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-3">Línea de tiempo</p>
        <ul className="border-l-2 border-ink-900/20 pl-5 space-y-4">
          {contact.lastLogin && (
            <li>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">
                {new Date(contact.lastLogin).toLocaleDateString('es-MX')}
              </p>
              <p className="text-sm text-ink-900">Último ingreso a la academia</p>
            </li>
          )}
          {(contact.orders ?? []).map((o: any) => (
            <li key={o._id || o.id}>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">
                {new Date(o.createdAt).toLocaleDateString('es-MX')}
              </p>
              <p className="text-sm text-ink-900">Compra ${o.total} {o.currency}</p>
            </li>
          ))}
          <li>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">
              {new Date(contact.createdAt).toLocaleDateString('es-MX')}
            </p>
            <p className="text-sm text-ink-900">Contacto creado</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

function InfoTab({ contact }: { contact: any }) {
  const rows: [string, string][] = [
    ['Correo', contact.email],
    ['Teléfono', contact.phone || '—'],
    ['Rol', contact.role],
    ['Plan', contact.plan],
    ['Estado', contact.isActive ? 'Activo' : 'Suspendido'],
    ['Verificado', contact.isEmailVerified ? 'Sí' : 'No'],
    ['Marketing', contact.marketingStatus ?? '—'],
    ['Estado contacto', contact.contactStatus ?? '—'],
  ];
  return (
    <dl className="border border-ink-900/15 bg-cream-100 divide-y divide-ink-900/10">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[200px_1fr] gap-4 px-5 py-3 text-sm">
          <dt className="text-[10px] uppercase tracking-[0.32em] text-ink-500 self-center">{k}</dt>
          <dd className="text-ink-900">{v}</dd>
        </div>
      ))}
      {contact.bio && (
        <div className="px-5 py-4 text-sm">
          <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-2">Biografía</p>
          <p className="text-ink-800 leading-relaxed">{contact.bio}</p>
        </div>
      )}
    </dl>
  );
}

function PurchasesTab({ orders }: { orders: any[] }) {
  if (!orders?.length) return <p className="text-sm text-ink-500 p-8 text-center border border-dashed border-ink-900/15">Sin compras registradas.</p>;
  return (
    <div className="border border-ink-900/15 bg-cream-100 divide-y divide-ink-900/10">
      {orders.map((o) => (
        <div key={o._id || o.id} className="px-5 py-4 grid grid-cols-[1fr_auto] gap-4">
          <div>
            <p className="text-sm font-semibold text-ink-900">
              {o.items?.[0]?.title ?? 'Pedido'}{o.items?.length > 1 && ` + ${o.items.length - 1}`}
            </p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mt-1">
              {new Date(o.createdAt).toLocaleDateString('es-MX')} · {o.status}
            </p>
          </div>
          <p className="font-serif text-xl text-ink-900">${o.total} <span className="text-xs text-ink-500">{o.currency}</span></p>
        </div>
      ))}
    </div>
  );
}

function ProductsTab({ courses, offers }: { courses: Array<string | Course>; offers: Offer[] }) {
  if (!courses?.length && !offers?.length) return <p className="text-sm text-ink-500 p-8 text-center border border-dashed border-ink-900/15">Sin productos otorgados.</p>;
  return (
    <div className="space-y-5">
      {offers.length > 0 && (
        <section>
          <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-3">Ofertas asignadas</p>
          <ul className="border border-ink-900/15 bg-cream-100 divide-y divide-ink-900/10">
            {offers.map((offer) => (
              <li key={offer._id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-ink-900 text-cream border border-ink-900/15 flex items-center justify-center text-[10px] uppercase tracking-[0.28em]">
                  {offer.type === 'trial' ? 'Test' : 'Oferta'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-900 truncate">{offer.title}</p>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">{offer.content.length} producto{offer.content.length === 1 ? '' : 's'}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-3">Cursos disponibles</p>
        <ul className="border border-ink-900/15 bg-cream-100 divide-y divide-ink-900/10">
      {courses.map((course) => {
        const courseId = typeof course === 'string' ? course : course._id || course.id || course.slug;
        const title = typeof course === 'string' ? course : course.title;
        return (
        <li key={courseId} className="px-5 py-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-cream-200 border border-ink-900/15 flex items-center justify-center text-[10px] uppercase tracking-[0.28em] text-ink-500">
            Curso
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink-900 truncate">{title}</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">Acceso completo</p>
          </div>
        </li>
        );
      })}
        </ul>
      </section>
    </div>
  );
}

function NotesTab({ id, initial }: { id: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const update = useUpdateNotes();
  useEffect(() => { setValue(initial); }, [initial]);
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={10}
        placeholder="Notas internas sobre este contacto…"
        className="w-full bg-cream-100 border border-ink-900/15 p-4 text-sm text-ink-900 focus:outline-none focus:border-ink-900 font-serif leading-relaxed"
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={() => update.mutate({ userId: id, notes: value })}
          disabled={update.isPending}
          className="btn-broadsheet disabled:opacity-50"
        >
          {update.isPending ? 'Guardando…' : 'Guardar notas'}
        </button>
      </div>
    </div>
  );
}

function TagsCard({ userId, userTags, allTags }: { userId: string; userTags: Tag[]; allTags: Tag[] }) {
  const assign = useAssignTag();
  const remove = useRemoveTag();
  const userTagIds = useMemo(() => userTags.map((t) => t._id), [userTags]);
  const available = allTags.filter((t) => !userTagIds.includes(t._id));

  return (
    <div className="border border-ink-900/15 bg-cream-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.32em] text-ink-700 font-semibold">Etiquetas</p>
        <Link to="/admin/etiquetas" className="text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-ink-900">
          Ver todas
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 min-h-[28px]">
        {userTags.length === 0 && <span className="text-xs text-ink-500">Sin etiquetas asignadas</span>}
        {userTags.map((t) => (
          <span key={t._id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-cream-200 border border-ink-900/15 text-[10px] uppercase tracking-[0.24em]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
            {t.name}
            <button onClick={() => remove.mutate({ userId, tagId: t._id })} className="text-ink-500 hover:text-ink-900 cursor-pointer ml-1">×</button>
          </span>
        ))}
      </div>

      <select
        onChange={(e) => {
          if (e.target.value) { assign.mutate({ userId, tagId: e.target.value }); e.target.value = ''; }
        }}
        className="ink-input text-xs cursor-pointer"
      >
        <option value="">Seleccionar etiqueta…</option>
        {available.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
      </select>
    </div>
  );
}

function EditModal({ id, contact, onClose }: { id: string; contact: any; onClose: () => void }) {
  const update = useUpdateUser();
  const [form, setForm] = useState({
    name: contact.name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    bio: contact.bio || '',
    contactStatus: contact.contactStatus || 'lead',
    marketingStatus: contact.marketingStatus || 'never_subscribed',
  });

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-cream border border-ink-900/20 shadow-xl p-7 max-h-[90vh] overflow-y-auto" style={{ animation: 'paper-unfold 320ms ease-out both' }}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Expediente</p>
        <h3 className="font-serif text-2xl text-ink-900 mb-5">Editar contacto</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            update.mutate({ id, data: form }, { onSuccess: onClose });
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="ink-label">Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ink-input" />
            </div>
            <div>
              <label className="ink-label">Correo</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="ink-input" />
            </div>
          </div>
          <div>
            <label className="ink-label">Teléfono</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="ink-input" />
          </div>
          <div>
            <label className="ink-label">Biografía</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="ink-input font-serif" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="ink-label">Estado contacto</label>
              <select value={form.contactStatus} onChange={(e) => setForm({ ...form, contactStatus: e.target.value as any })} className="ink-input cursor-pointer">
                <option value="lead">Lead</option>
                <option value="customer">Cliente</option>
                <option value="churned">Inactivo</option>
              </select>
            </div>
            <div>
              <label className="ink-label">Marketing</label>
              <select value={form.marketingStatus} onChange={(e) => setForm({ ...form, marketingStatus: e.target.value as any })} className="ink-input cursor-pointer">
                <option value="never_subscribed">No suscrito</option>
                <option value="subscribed">Suscrito</option>
                <option value="unsubscribed">Baja</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button type="button" onClick={onClose} className="flex-1 text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 py-2.5 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={update.isPending} className="btn-broadsheet flex-1 disabled:opacity-50">
              {update.isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useOffers, useCreateOffer, useDeleteOffer, useUpdateOffer } from '@hooks/useOffers';
import { useCourses } from '@hooks/useCourses';
import type { Offer } from '@t/index';

/**
 * Ofertas públicas (bundles temporales, ej: "3 cursos por $999").
 *
 * A diferencia de los Paquetes (Entrepreneur/Business/Master) — que son un
 * catálogo fijo de suscripción — las Ofertas son promos individuales, con
 * vigencia (startsAt / expiresAt) y contenido arbitrario (cursos, eventos, libros).
 *
 * Aparecen en la web con checkout automático mientras estén "published".
 */
export default function ManageOffers() {
  const { data: offers = [], isLoading } = useOffers();
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const courses = coursesData?.data ?? [];
  const create = useCreateOffer();
  const update = useUpdateOffer();
  const del = useDeleteOffer();

  const [editing, setEditing] = useState<Offer | null>(null);
  const [showNew, setShowNew] = useState(false);

  const fmtMoney = (n: number, ccy: string) =>
    n === 0
      ? 'Gratuita'
      : new Intl.NumberFormat('es-MX', { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Ofertas</h1>
            <p className="text-sm text-ink-600 mt-3 max-w-2xl">
              Bundles públicos temporales (por ejemplo: <em>“3 cursos por $999”</em>). Aparecen automáticamente
              en la web mientras estén publicadas y se compran directamente por checkout. Distintas de los
              <b> Paquetes</b> de suscripción y de las <b>Promociones</b> (códigos de descuento).
            </p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-broadsheet">
            + Nueva oferta
          </button>
        </div>
      </header>

      <div className="bg-cream-100 border border-ink-900/15 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="bg-cream-200 border-b border-ink-900/15">
            <tr>
              {['Título', 'Contenido', 'Vigencia', 'Precio', 'Estado', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-ink-500 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/10">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-ink-500">
                  Cargando…
                </td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-ink-500 italic font-serif">
                  Aún no hay ofertas. Crea la primera para publicarla en la web.
                </td>
              </tr>
            ) : (
              offers.map((o) => (
                <tr key={o._id} className="hover:bg-cream-50">
                  <td className="px-4 py-3">
                    <p className="font-serif text-ink-900 text-base leading-tight">{o.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{o.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-700">
                    {o.content?.length ?? 0} elemento{(o.content?.length ?? 0) === 1 ? '' : 's'}
                  </td>
                  <td className="px-4 py-3 text-ink-600 text-xs">
                    {o.startsAt ? new Date(o.startsAt).toLocaleDateString('es-MX') : '—'}
                    <span className="mx-1">→</span>
                    {o.expiresAt ? new Date(o.expiresAt).toLocaleDateString('es-MX') : '∞'}
                  </td>
                  <td className="px-4 py-3 font-medium">{fmtMoney(o.price, o.currency)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button
                      onClick={() => setEditing(o)}
                      className="text-[10px] uppercase tracking-[0.28em] text-ink-700 hover:text-ink-900 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la oferta “${o.title}”?`)) del.mutate(o._id);
                      }}
                      className="text-[10px] uppercase tracking-[0.28em] text-red-700 hover:text-red-900 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(showNew || editing) && (
        <OfferModal
          offer={editing}
          courses={courses}
          onClose={() => {
            setShowNew(false);
            setEditing(null);
          }}
          onSave={(data) => {
            if (editing) update.mutate({ id: editing._id, input: data });
            else create.mutate(data as any);
            setShowNew(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Offer['status'] }) {
  const cls =
    status === 'published'
      ? 'bg-ink-900 text-cream'
      : status === 'archived'
        ? 'border border-ink-400 text-ink-500'
        : 'border border-ink-900 text-ink-900';
  return (
    <span className={`text-[10px] uppercase tracking-[0.28em] px-2 py-1 ${cls}`}>
      {status === 'published' ? 'Publicada' : status === 'archived' ? 'Archivada' : 'Borrador'}
    </span>
  );
}

function OfferModal({
  offer,
  courses,
  onClose,
  onSave,
}: {
  offer: Offer | null;
  courses: Array<{ _id?: string; id?: string; title: string }>;
  onClose: () => void;
  onSave: (data: Partial<Offer>) => void;
}) {
  const [form, setForm] = useState({
    title: offer?.title ?? '',
    slug: offer?.slug ?? '',
    description: offer?.description ?? '',
    price: offer?.price ?? 0,
    currency: offer?.currency ?? 'MXN',
    status: offer?.status ?? 'draft',
    startsAt: offer?.startsAt?.slice(0, 10) ?? '',
    expiresAt: offer?.expiresAt?.slice(0, 10) ?? '',
            courseIds: (offer?.content ?? []).map((c) => c.courseId),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-cream-100 border border-ink-900/15 p-8 max-h-[90vh] overflow-y-auto">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500">{offer ? 'Editar' : 'Nueva'}</p>
        <h2 className="font-serif text-3xl mt-1 mb-6 text-ink-900">
          {offer ? 'Editar oferta' : 'Crear oferta'}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="ink-label">Título</label>
            <input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  slug: offer
                    ? f.slug
                    : title
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, ''),
                }));
              }}
              className="ink-input"
              placeholder="Ej. Bundle Fiscal 3x1"
            />
          </div>

          <div>
            <label className="ink-label">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="ink-input font-mono text-xs"
            />
          </div>

          <div>
            <label className="ink-label">Descripción</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="ink-input font-serif"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="ink-label">Precio</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: +e.target.value })}
                className="ink-input"
              />
            </div>
            <div>
              <label className="ink-label">Moneda</label>
              <input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                className="ink-input uppercase"
              />
            </div>
            <div>
              <label className="ink-label">Vigente desde</label>
              <input
                type="date"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className="ink-input"
              />
            </div>
            <div>
              <label className="ink-label">Vigente hasta</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="ink-input"
              />
            </div>
          </div>

          <div>
            <label className="ink-label">Estado</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Offer['status'] })}
              className="ink-input cursor-pointer"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicada (visible en /academia)</option>
              <option value="archived">Archivada</option>
            </select>
          </div>

          <div>
            <label className="ink-label">Cursos incluidos</label>
            <div className="border border-ink-900/10 p-2 bg-cream max-h-40 overflow-y-auto space-y-0.5">
              {courses.map((c) => {
                const cid = String(c._id || c.id);
                const checked = form.courseIds.includes(cid);
                return (
                  <label
                    key={cid}
                    className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer hover:bg-cream-200"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setForm((f) => ({
                          ...f,
                          courseIds: checked
                            ? f.courseIds.filter((x) => x !== cid)
                            : [...f.courseIds, cid],
                        }))
                      }
                    />
                    <span className="font-serif truncate">{c.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm px-4 py-2 border border-ink-900/20 hover:bg-cream-200 cursor-pointer">
              Cancelar
            </button>
            <button
              type="button"
              onClick={() =>
                onSave({
                  title: form.title,
                  slug: form.slug,
                  description: form.description,
                  price: form.price,
                  currency: form.currency,
                  status: form.status as Offer['status'],
                  type: 'standard',
                  startsAt: form.startsAt || null,
                  expiresAt: form.expiresAt || null,
                  content: form.courseIds.map((courseId) => ({
                    courseId,
                    access: 'full',
                    moduleIds: [],
                  })) as Offer['content'],
                })
              }
              className="btn-broadsheet"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { usePromotions, useCreatePromotion, useDeletePromotion, useUpdatePromotion } from '@hooks/usePromotions';
import { usePackages } from '@hooks/usePackages';
import { useOffers } from '@hooks/useOffers';
import { useCourses } from '@hooks/useCourses';
import { useEvents } from '@hooks/useEvents';
import { useBooks } from '@hooks/useBooks';
import toast from 'react-hot-toast';
import type { Promotion } from '@t/index';

type Scope = 'all' | 'course' | 'package' | 'offer' | 'event' | 'book';

// Eventos y libros pueden dejar el objetivo vacío: aplica a todos los de ese tipo.
const TARGET_OPTIONAL: Scope[] = ['all', 'event', 'book'];

// Varias ediciones comparten título: se distinguen por fecha y sede.
const eventLabel = (e: any) => {
  const date = e.startDate ? new Date(e.startDate) : null;
  const dateLabel =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Mexico_City' })
      : '';
  return [e.title, dateLabel, e.location].filter(Boolean).join(' · ');
};

export default function ManagePromotions() {
  const { data: promotions = [], isLoading } = usePromotions();
  const { data: packages = [] } = usePackages();
  const { data: offers = [] } = useOffers();
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const courses = coursesData?.data ?? [];
  const { data: eventsData } = useEvents({ limit: 200, status: "all" });
  const events = eventsData?.data ?? [];
  const { data: books = [] } = useBooks();
  const create = useCreatePromotion();
  const del = useDeletePromotion();
  const upd = useUpdatePromotion();
  const [form, setForm] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    scope: 'all' as Scope,
    targetId: '',
    maxUses: 0,
    expiresAt: '',
  });

  const targetOptions =
    form.scope === 'package'
      ? packages.map((p) => ({ id: p._id, label: p.name }))
      : form.scope === 'offer'
        ? offers.map((o) => ({ id: o._id, label: o.title }))
        : form.scope === 'course'
          ? courses.map((c: any) => ({ id: String(c._id || c.id), label: c.title }))
          : form.scope === 'event'
            ? events.map((e: any) => ({ id: String(e._id || e.id), label: eventLabel(e) }))
            : form.scope === 'book'
              ? books.map((b: any) => ({ id: String(b._id || b.id), label: b.title }))
              : [];

  const scopeLabel = (p: Promotion) => {
    if (p.scope === 'event' && !p.targetId) return 'Todos los eventos';
    if (p.scope === 'book' && !p.targetId) return 'Todos los libros';
    if (p.scope === 'all' || !p.targetId) return 'Todo';
    if (p.scope === 'event') {
      const event = events.find((x: any) => String(x._id || x.id) === p.targetId);
      return `Evento: ${event ? eventLabel(event) : p.targetId}`;
    }
    if (p.scope === 'book') return `Libro: ${books.find((x: any) => String(x._id || x.id) === p.targetId)?.title ?? p.targetId}`;
    if (p.scope === 'package') return `Paquete: ${packages.find((x) => x._id === p.targetId)?.name ?? p.targetId}`;
    if (p.scope === 'offer') return `Oferta: ${offers.find((x) => x._id === p.targetId)?.title ?? p.targetId}`;
    if (p.scope === 'course') return `Curso: ${courses.find((x: any) => String(x._id || x.id) === p.targetId)?.title ?? p.targetId}`;
    return p.scope;
  };

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-900 leading-none">Promociones</h1>
        <p className="text-sm text-ink-600 mt-3 max-w-2xl">
          Códigos de descuento aplicables al checkout. Pueden ser porcentaje o monto fijo, globales o
          limitados a un <b>paquete</b>, <b>oferta</b>, <b>curso</b>, <b>evento</b> o <b>libro</b>.
        </p>
      </header>

      {/* Crear */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.code.trim()) return;
          if (!TARGET_OPTIONAL.includes(form.scope) && !form.targetId) {
            toast.error('Selecciona el producto al que aplica el código');
            return;
          }
          create.mutate(
            {
              ...form,
              targetId: form.scope === 'all' ? '' : form.targetId,
              expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
            } as any,
            {
              onSuccess: () =>
                setForm({
                  code: '',
                  description: '',
                  type: 'percentage',
                  value: 10,
                  scope: 'all',
                  targetId: '',
                  maxUses: 0,
                  expiresAt: '',
                }),
            },
          );
        }}
        className="border border-ink-900/15 bg-cream-100 p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div>
          <label className="ink-label">Código</label>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="EJ. VIP25"
            className="ink-input uppercase"
          />
        </div>
        <div>
          <label className="ink-label">Descripción</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="ink-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="ink-label">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="ink-input cursor-pointer"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo ($)</option>
            </select>
          </div>
          <div>
            <label className="ink-label">Valor</label>
            <input
              type="number"
              min={0}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: +e.target.value })}
              className="ink-input"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="ink-label">Aplica a</label>
            <select
              value={form.scope}
              onChange={(e) => setForm({ ...form, scope: e.target.value as Scope, targetId: '' })}
              className="ink-input cursor-pointer"
            >
              <option value="all">Todo el catálogo</option>
              <option value="package">Un paquete</option>
              <option value="offer">Una oferta</option>
              <option value="course">Un curso</option>
              <option value="event">Eventos</option>
              <option value="book">Libros</option>
            </select>
          </div>
          <div>
            <label className="ink-label">Objetivo</label>
            <select
              value={form.targetId}
              onChange={(e) => setForm({ ...form, targetId: e.target.value })}
              disabled={form.scope === 'all'}
              className="ink-input cursor-pointer disabled:opacity-50"
            >
              <option value="">{form.scope === 'all' ? '—' : TARGET_OPTIONAL.includes(form.scope) ? 'Todos' : 'Selecciona…'}</option>
              {targetOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="ink-label">Usos máx (0=∞)</label>
            <input
              type="number"
              min={0}
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: +e.target.value })}
              className="ink-input"
            />
          </div>
          <div>
            <label className="ink-label">Expira</label>
            <input
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="ink-input"
            />
          </div>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={create.isPending} className="btn-broadsheet disabled:opacity-50">
            + Crear código
          </button>
        </div>
      </form>

      {/* Listado */}
      <div className="border border-ink-900/15 bg-cream-100 overflow-x-auto">
        <div className="min-w-[900px]">
        <div className="grid grid-cols-[1fr_1.4fr_1.6fr_100px_90px_100px_100px_60px] gap-3 px-5 py-3 border-b border-ink-900/15 text-[10px] uppercase tracking-[0.28em] text-ink-500">
          <span>Código</span>
          <span>Descripción</span>
          <span>Aplica a</span>
          <span>Descuento</span>
          <span>Usos</span>
          <span>Expira</span>
          <span>Estado</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando…</p>
        ) : promotions.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-500 italic font-serif">Aún no hay códigos.</p>
        ) : (
          promotions.map((p: Promotion) => (
            <div
              key={p._id}
              className="grid grid-cols-[1fr_1.4fr_1.6fr_100px_90px_100px_100px_60px] gap-3 px-5 py-3.5 border-b border-ink-900/10 last:border-0 items-center text-sm"
            >
              <span className="font-mono font-semibold text-ink-900">{p.code}</span>
              <span className="text-ink-700 truncate">{p.description || '—'}</span>
              <span className="text-ink-700 text-xs truncate">{scopeLabel(p)}</span>
              <span className="font-serif text-ink-900">
                {p.type === 'percentage' ? `${p.value}%` : `$${p.value}`}
              </span>
              <span className="text-ink-700">
                {p.usedCount}
                {p.maxUses > 0 ? ` / ${p.maxUses}` : ''}
              </span>
              <span className="text-xs text-ink-600">
                {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('es-MX') : '—'}
              </span>
              <button
                onClick={() => upd.mutate({ id: p._id, data: { isActive: !p.isActive } })}
                className={
                  'text-[10px] uppercase tracking-[0.28em] cursor-pointer ' +
                  (p.isActive ? 'text-emerald-700' : 'text-ink-500')
                }
              >
                {p.isActive ? 'Activo' : 'Pausado'}
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar el código "${p.code}"?`)) del.mutate(p._id);
                }}
                className="text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-red-700 cursor-pointer"
              >
                Borrar
              </button>
            </div>
          ))
        )}
        </div>
      </div>
    </div>
  );
}

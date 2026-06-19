import { useState } from 'react';
import { usePromotions, useCreatePromotion, useDeletePromotion, useUpdatePromotion } from '@hooks/usePromotions';
import type { Promotion } from '@t/index';

export default function ManagePromotions() {
  const { data: promotions = [], isLoading } = usePromotions();
  const create = useCreatePromotion();
  const del = useDeletePromotion();
  const upd = useUpdatePromotion();
  const [form, setForm] = useState({ code: '', description: '', type: 'percentage' as 'percentage' | 'fixed', value: 10, scope: 'all' as 'all' | 'course' | 'package', maxUses: 0, expiresAt: '' });

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Promociones</h1>
        <p className="text-sm text-ink-600 mt-3 max-w-xl">
          Códigos de descuento aplicables a checkout. Pueden ser porcentaje o monto fijo, globales o por curso/paquete.
        </p>
      </header>

      {/* Crear */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.code.trim()) return;
          create.mutate(
            { ...form, expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null } as any,
            { onSuccess: () => setForm({ code: '', description: '', type: 'percentage', value: 10, scope: 'all', maxUses: 0, expiresAt: '' }) },
          );
        }}
        className="border border-ink-900/15 bg-cream-100 p-5 mb-6 grid grid-cols-1 md:grid-cols-[1fr_2fr_120px_120px_120px_120px_auto] gap-3 items-end"
      >
        <div><label className="ink-label">Código</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="EJ. VIP25" className="ink-input uppercase" /></div>
        <div><label className="ink-label">Descripción</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ink-input" /></div>
        <div>
          <label className="ink-label">Tipo</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="ink-input cursor-pointer">
            <option value="percentage">%</option>
            <option value="fixed">$</option>
          </select>
        </div>
        <div><label className="ink-label">Valor</label><input type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} className="ink-input" /></div>
        <div><label className="ink-label">Usos máx (0=∞)</label><input type="number" min={0} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: +e.target.value })} className="ink-input" /></div>
        <div><label className="ink-label">Expira</label><input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="ink-input" /></div>
        <button type="submit" disabled={create.isPending} className="btn-broadsheet disabled:opacity-50">+ Crear</button>
      </form>

      {/* Listado */}
      <div className="border border-ink-900/15 bg-cream-100">
        <div className="grid grid-cols-[1fr_2fr_100px_120px_100px_100px_80px] gap-4 px-5 py-3 border-b border-ink-900/15 text-[10px] uppercase tracking-[0.32em] text-ink-500">
          <span>Código</span>
          <span>Descripción</span>
          <span>Descuento</span>
          <span>Usos</span>
          <span>Expira</span>
          <span>Activo</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando…</p>
        ) : promotions.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-500">Aún no hay códigos.</p>
        ) : (
          promotions.map((p: Promotion) => (
            <div key={p._id} className="grid grid-cols-[1fr_2fr_100px_120px_100px_100px_80px] gap-4 px-5 py-3.5 border-b border-ink-900/10 last:border-0 items-center text-sm">
              <span className="font-mono font-semibold text-ink-900">{p.code}</span>
              <span className="text-ink-700 truncate">{p.description || '—'}</span>
              <span className="font-serif text-ink-900">{p.type === 'percentage' ? `${p.value}%` : `$${p.value}`}</span>
              <span className="text-ink-700">{p.usedCount}{p.maxUses > 0 ? ` / ${p.maxUses}` : ''}</span>
              <span className="text-xs text-ink-600">{p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('es-MX') : '—'}</span>
              <button
                onClick={() => upd.mutate({ id: p._id, data: { isActive: !p.isActive } })}
                className={`text-[10px] uppercase tracking-[0.28em] cursor-pointer ${p.isActive ? 'text-emerald-700' : 'text-ink-500'}`}
              >
                {p.isActive ? 'Activo' : 'Pausado'}
              </button>
              <button
                onClick={() => { if (confirm(`¿Eliminar el código "${p.code}"?`)) del.mutate(p._id); }}
                className="text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-red-700 cursor-pointer"
              >
                Borrar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

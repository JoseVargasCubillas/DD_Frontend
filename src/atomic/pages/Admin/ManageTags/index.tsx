import { useState } from 'react';
import { useTags, useCreateTag, useDeleteTag, useUpdateTag } from '@hooks/useTags';
import type { Tag } from '@t/index';

const PALETTE = ['#0a0a0a', '#7c2d12', '#92400e', '#365314', '#0c4a6e', '#581c87', '#9f1239'];

export default function ManageTags() {
  const { data: tags = [], isLoading } = useTags();
  const create = useCreateTag();
  const del = useDeleteTag();
  const upd = useUpdateTag();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE[0]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Comunidad</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Etiquetas</h1>
        <p className="text-sm text-ink-600 mt-3 max-w-xl">
          Segmenta a tus contactos asignándoles etiquetas que reflejen su interés, curso, o etapa del funnel.
        </p>
      </header>

      {/* Crear */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate({ name: name.trim(), color }, { onSuccess: () => setName('') });
        }}
        className="border border-ink-900/15 bg-cream-100 p-5 mb-6 flex flex-wrap items-end gap-3"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="ink-label">Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="ink-input" placeholder="Ej. VIP, Curso fiscal, Lead frío…" />
        </div>
        <div>
          <label className="ink-label">Color</label>
          <div className="flex gap-1.5 mt-1">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full border-2 cursor-pointer ${color === c ? 'border-ink-900' : 'border-cream-200'}`}
                style={{ background: c }}
                title={c}
              />
            ))}
          </div>
        </div>
        <button type="submit" disabled={create.isPending} className="btn-broadsheet disabled:opacity-50">
          {create.isPending ? 'Creando…' : '+ Etiqueta'}
        </button>
      </form>

      {/* Listado */}
      <div className="border border-ink-900/15 bg-cream-100">
        <div className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-5 py-3 border-b border-ink-900/15 text-[10px] uppercase tracking-[0.32em] text-ink-500">
          <span>Etiqueta</span>
          <span>Contactos</span>
          <span>Creada</span>
          <span />
        </div>
        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando…</p>
        ) : tags.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-500">Aún no hay etiquetas.</p>
        ) : (
          tags.map((t: Tag) => (
            <div key={t._id} className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-5 py-3.5 border-b border-ink-900/10 last:border-0 items-center">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                <input
                  defaultValue={t.name}
                  onBlur={(e) => { if (e.target.value !== t.name) upd.mutate({ id: t._id, data: { name: e.target.value } }); }}
                  className="bg-transparent text-sm font-semibold text-ink-900 focus:outline-none border-b border-transparent focus:border-ink-900"
                />
              </div>
              <span className="text-sm text-ink-700">{t.contactsCount ?? 0}</span>
              <span className="text-xs text-ink-600">{t.createdAt ? new Date(t.createdAt).toLocaleDateString('es-MX') : '—'}</span>
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar la etiqueta "${t.name}"?`)) del.mutate(t._id);
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
  );
}

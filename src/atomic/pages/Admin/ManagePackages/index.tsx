import { useState } from 'react';
import { usePackages, useCreatePackage, useDeletePackage, useUpdatePackage } from '@hooks/usePackages';
import { useCourses } from '@hooks/useCourses';
import type { Package, Course } from '@t/index';

export default function ManagePackages() {
  const { data: packages = [], isLoading } = usePackages();
  const { data: coursesData } = useCourses({ includeAll: true, limit: 100 } as any);
  const courses = coursesData?.data ?? [];
  const create = useCreatePackage();
  const del = useDeletePackage();
  const upd = useUpdatePackage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Paquetes</h1>
            <p className="text-sm text-ink-600 mt-3">
              Agrupa cursos en paquetes con precio y duración. Luego asígnalos a tus clientes desde su perfil.
            </p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-broadsheet">+ Nuevo paquete</button>
        </div>
      </header>

      <div className="border border-ink-900/15 bg-cream-100">
        <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr_120px] gap-4 px-5 py-3 border-b border-ink-900/15 text-[10px] uppercase tracking-[0.32em] text-ink-500">
          <span>Paquete</span>
          <span>Precio</span>
          <span>Duración</span>
          <span>Cursos</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando…</p>
        ) : packages.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-500">Aún no hay paquetes.</p>
        ) : (
          packages.map((p: Package) => (
            <div key={p._id} className="border-b border-ink-900/10 last:border-0">
              <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr_120px] gap-4 px-5 py-4 items-center text-sm">
                <div>
                  <p className="font-serif text-lg text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-500">{p.description || '—'}</p>
                </div>
                <p className="font-serif text-lg text-ink-900">${p.price} <span className="text-xs text-ink-500">{p.currency}</span></p>
                <p className="text-ink-700">{p.durationDays > 0 ? `${p.durationDays} días` : 'De por vida'}</p>
                <p className="text-ink-700">{p.courseIds.length}</p>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(editingId === p._id ? null : p._id)} className="text-[10px] uppercase tracking-[0.28em] text-ink-700 hover:text-ink-900 cursor-pointer">
                    {editingId === p._id ? 'Cerrar' : 'Editar'}
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar el paquete "${p.name}"?`)) del.mutate(p._id); }}
                    className="text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-red-700 cursor-pointer"
                  >
                    Borrar
                  </button>
                </div>
              </div>

              {editingId === p._id && (
                <EditPackagePanel pkg={p} courses={courses} onSave={(data) => upd.mutate({ id: p._id, data })} />
              )}
            </div>
          ))
        )}
      </div>

      {showNew && <NewPackageModal courses={courses} onClose={() => setShowNew(false)} onCreate={(data) => create.mutate(data as any, { onSuccess: () => setShowNew(false) })} />}
    </div>
  );
}

function EditPackagePanel({ pkg, courses, onSave }: { pkg: Package; courses: Course[]; onSave: (data: Partial<Package>) => void }) {
  const [form, setForm] = useState({
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    currency: pkg.currency,
    durationDays: pkg.durationDays,
    isActive: pkg.isActive,
    isFeatured: pkg.isFeatured,
    courseIds: [...pkg.courseIds],
  });

  const toggle = (cid: string) => {
    setForm((f) => ({ ...f, courseIds: f.courseIds.includes(cid) ? f.courseIds.filter((x) => x !== cid) : [...f.courseIds, cid] }));
  };

  return (
    <div className="bg-cream-200/40 border-t border-ink-900/10 p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><label className="ink-label">Nombre</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ink-input" /></div>
        <div><label className="ink-label">Precio</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="ink-input" /></div>
        <div className="md:col-span-2"><label className="ink-label">Descripción</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ink-input font-serif" /></div>
        <div><label className="ink-label">Duración (días, 0=de por vida)</label><input type="number" min={0} value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: +e.target.value })} className="ink-input" /></div>
        <div><label className="ink-label">Moneda</label><input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="ink-input" /></div>
      </div>

      <div>
        <p className="ink-label mb-2">Cursos incluidos</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto border border-ink-900/10 p-2 bg-cream">
          {courses.map((c) => {
            const cid = String(c._id || c.id);
            const checked = form.courseIds.includes(cid);
            return (
              <label key={cid} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-cream-200 text-sm">
                <input type="checkbox" checked={checked} onChange={() => toggle(cid)} />
                <span className="font-serif text-ink-900 truncate">{c.title}</span>
              </label>
            );
          })}
          {courses.length === 0 && <p className="text-xs text-ink-500 p-2">Crea cursos primero.</p>}
        </div>
      </div>

      <div className="flex gap-4 text-sm text-ink-700">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Activo</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Destacado</label>
      </div>

      <button onClick={() => onSave(form)} className="btn-broadsheet">Guardar paquete</button>
    </div>
  );
}

function NewPackageModal({ courses, onClose, onCreate }: { courses: Course[]; onClose: () => void; onCreate: (data: any) => void }) {
  const [form, setForm] = useState({ name: '', description: '', price: 0, currency: 'MXN', durationDays: 0, courseIds: [] as string[] });

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-cream border border-ink-900/20 shadow-xl p-7 max-h-[90vh] overflow-y-auto" style={{ animation: 'paper-unfold 320ms ease-out both' }}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Academia</p>
        <h3 className="font-serif text-2xl text-ink-900 mb-5">Nuevo paquete</h3>
        <form onSubmit={(e) => { e.preventDefault(); onCreate(form); }} className="space-y-4">
          <div><label className="ink-label">Nombre</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ink-input" /></div>
          <div><label className="ink-label">Descripción</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ink-input font-serif" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="ink-label">Precio</label><input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="ink-input" /></div>
            <div><label className="ink-label">Duración (días)</label><input type="number" min={0} value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: +e.target.value })} className="ink-input" /></div>
          </div>
          <div>
            <p className="ink-label mb-2">Cursos</p>
            <div className="border border-ink-900/15 max-h-40 overflow-y-auto p-2 bg-cream-100">
              {courses.map((c) => {
                const cid = String(c._id || c.id);
                const checked = form.courseIds.includes(cid);
                return (
                  <label key={cid} className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-cream-200 text-sm">
                    <input type="checkbox" checked={checked} onChange={() => setForm((f) => ({ ...f, courseIds: checked ? f.courseIds.filter((x) => x !== cid) : [...f.courseIds, cid] }))} />
                    <span className="font-serif text-ink-900 truncate">{c.title}</span>
                  </label>
                );
              })}
              {courses.length === 0 && <p className="text-xs text-ink-500 p-2">Aún no hay cursos.</p>}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 py-2.5 cursor-pointer">Cancelar</button>
            <button type="submit" className="btn-broadsheet flex-1">Crear paquete</button>
          </div>
        </form>
      </div>
    </div>
  );
}

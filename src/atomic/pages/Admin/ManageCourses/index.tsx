import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCourses } from '@hooks/useCourses';
import { createCourse } from '@api/courses.api';
import type { Course } from '@t/index';

export default function ManageCourses() {
  const { data, isLoading } = useCourses({ status: '', includeAll: true } as any);
  const courses = data?.data ?? [];
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Cursos</h1>
            <p className="text-sm text-ink-600 mt-3">{courses.length} título{courses.length === 1 ? '' : 's'} en catálogo.</p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-broadsheet">+ Nuevo curso</button>
        </div>
      </header>

      <div className="border border-ink-900/15 bg-cream-100">
        <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_80px] gap-4 px-5 py-3 border-b border-ink-900/15 text-[10px] uppercase tracking-[0.32em] text-ink-500">
          <span>Título</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Estado</span>
          <span>Inscritos</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando…</p>
        ) : courses.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-500">Aún no hay cursos. Crea el primero.</p>
        ) : (
          courses.map((c: Course) => {
            const id = String(c._id || c.id);
            return (
              <div key={id} className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_80px] gap-4 px-5 py-4 border-b border-ink-900/10 last:border-0 items-center text-sm">
                <p className="font-serif text-ink-900 truncate">{c.title}</p>
                <p className="text-ink-700">{c.category || '—'}</p>
                <p className="font-serif text-ink-900">${c.price}</p>
                <p>
                  <span className="text-[10px] uppercase tracking-[0.28em] border border-ink-900/25 px-2 py-1">
                    {c.status}
                  </span>
                </p>
                <p className="text-ink-700">{c.enrolledCount ?? 0}</p>
                <Link to={`/admin/cursos/${id}`} className="text-[10px] uppercase tracking-[0.28em] text-ink-700 hover:text-ink-900 underline underline-offset-4 cursor-pointer">
                  Editar
                </Link>
              </div>
            );
          })
        )}
      </div>

      {showNew && <NewCourseModal onClose={() => setShowNew(false)} />}
    </div>
  );
}

function NewCourseModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: '', description: '', price: 0, category: '' });
  const mut = useMutation({
    mutationFn: () => createCourse(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso creado');
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-cream border border-ink-900/20 shadow-xl p-7" style={{ animation: 'paper-unfold 320ms ease-out both' }}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Academia</p>
        <h3 className="font-serif text-2xl text-ink-900 mb-5">Nuevo curso</h3>
        <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="space-y-4">
          <div>
            <label className="ink-label">Título</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="ink-input" />
          </div>
          <div>
            <label className="ink-label">Descripción</label>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ink-input font-serif" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="ink-label">Categoría</label>
              <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="ink-input" />
            </div>
            <div>
              <label className="ink-label">Precio</label>
              <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="ink-input" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 py-2.5 cursor-pointer">Cancelar</button>
            <button type="submit" disabled={mut.isPending} className="btn-broadsheet flex-1 disabled:opacity-50">
              {mut.isPending ? 'Creando…' : 'Crear curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCourseAdmin } from '@hooks/useCourses';
import { useModules, useCreateModule, useDeleteModule, useUpdateModule, useAddLesson } from '@hooks/useModules';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourse } from '@api/courses.api';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourseAdmin(id);
  const { data: modules = [] } = useModules(id);
  const create = useCreateModule(id);
  const [newTitle, setNewTitle] = useState('');

  if (isLoading) return <p className="text-sm text-ink-500">Cargando…</p>;
  if (!course) return <p className="text-sm text-ink-500">Curso no encontrado.</p>;

  return (
    <div className="space-y-8">
      <header>
        <Link to="/admin/cursos" className="text-[10px] uppercase tracking-[0.32em] text-ink-600 hover:text-ink-900">
          ← Cursos
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Editar curso</p>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">{course.title}</h1>
            <p className="text-sm text-ink-600 mt-2">{course.shortDescription || course.description}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500">Precio</p>
            <p className="font-serif text-3xl text-ink-900">${course.price}</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mt-1">{course.status}</p>
          </div>
        </div>
      </header>

      <CourseInfoForm id={id} course={course} />

      {/* Módulos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-ink-900">Módulos</h2>
          <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500">{modules.length} módulo{modules.length === 1 ? '' : 's'}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newTitle.trim()) return;
            create.mutate({ title: newTitle.trim() }, { onSuccess: () => setNewTitle('') });
          }}
          className="flex gap-2 mb-6"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nombre del nuevo módulo"
            className="ink-input flex-1"
          />
          <button type="submit" disabled={create.isPending} className="btn-broadsheet disabled:opacity-50">+ Módulo</button>
        </form>

        <div className="space-y-3">
          {modules.length === 0 && (
            <p className="border border-dashed border-ink-900/15 p-8 text-center text-sm text-ink-500">
              Aún no hay módulos. Crea el primero arriba.
            </p>
          )}
          {modules.map((m, i) => <ModuleCard key={m._id} courseId={id} module={m} index={i} />)}
        </div>
      </section>
    </div>
  );
}

function CourseInfoForm({ id, course }: { id: string; course: any }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: course.title,
    description: course.description || '',
    shortDescription: course.shortDescription || '',
    price: course.price,
    category: course.category,
    status: course.status,
  });
  const mut = useMutation({
    mutationFn: () => updateCourse(id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['course-admin', id] });
      qc.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso guardado');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}
      className="border border-ink-900/15 bg-cream-100 p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="md:col-span-2">
        <label className="ink-label">Título</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="ink-input" />
      </div>
      <div className="md:col-span-2">
        <label className="ink-label">Descripción corta</label>
        <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="ink-input" />
      </div>
      <div className="md:col-span-2">
        <label className="ink-label">Descripción</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="ink-input font-serif" />
      </div>
      <div>
        <label className="ink-label">Categoría</label>
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="ink-input" />
      </div>
      <div>
        <label className="ink-label">Precio</label>
        <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="ink-input" />
      </div>
      <div>
        <label className="ink-label">Estado</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="ink-input cursor-pointer">
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
          <option value="archived">Archivado</option>
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit" disabled={mut.isPending} className="btn-broadsheet w-full disabled:opacity-50">
          {mut.isPending ? 'Guardando…' : 'Guardar información'}
        </button>
      </div>
    </form>
  );
}

function ModuleCard({ courseId, module, index }: { courseId: string; module: any; index: number }) {
  const del = useDeleteModule(courseId);
  const upd = useUpdateModule(courseId);
  const add = useAddLesson(courseId);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [newLesson, setNewLesson] = useState({ title: '', videoUrl: '', duration: 0 });

  return (
    <div className="border border-ink-900/15 bg-cream-100">
      <div className="flex items-center gap-4 px-5 py-4">
        <span className="font-serif text-2xl text-ink-500 w-8">{String(index + 1).padStart(2, '0')}</span>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => { setEditing(false); if (title !== module.title) upd.mutate({ id: module._id, data: { title } }); }}
              onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
              className="bg-transparent text-base font-semibold text-ink-900 focus:outline-none border-b border-ink-900"
            />
          ) : (
            <button onClick={() => setEditing(true)} className="text-base font-semibold text-ink-900 cursor-pointer hover:underline underline-offset-4">
              {module.title}
            </button>
          )}
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mt-0.5">
            {module.lessons?.length ?? module.lessonIds?.length ?? 0} lecciones
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="text-[10px] uppercase tracking-[0.28em] text-ink-600 hover:text-ink-900 cursor-pointer">
          {open ? 'Cerrar' : 'Ver'}
        </button>
        <button
          onClick={() => { if (confirm(`¿Eliminar el módulo "${module.title}" y sus lecciones?`)) del.mutate(module._id); }}
          className="text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-red-700 cursor-pointer"
        >
          Borrar
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-900/10 px-5 py-4 bg-cream-200/30">
          {(module.lessons ?? []).length === 0 && (
            <p className="text-sm text-ink-500 mb-3">Aún no hay lecciones en este módulo.</p>
          )}
          {(module.lessons ?? []).map((l: any, i: number) => (
            <div key={l._id} className="flex items-center gap-3 py-2 border-b border-ink-900/10 last:border-0">
              <span className="text-xs text-ink-500 w-6">{i + 1}.</span>
              <span className="text-sm font-semibold text-ink-900 flex-1">{l.title}</span>
              {l.duration > 0 && <span className="text-xs text-ink-500">{Math.round(l.duration / 60)} min</span>}
              {l.videoUrl && <span className="text-[10px] uppercase tracking-[0.24em] text-emerald-700">video</span>}
            </div>
          ))}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newLesson.title.trim()) return;
              add.mutate(
                { moduleId: module._id, input: newLesson },
                { onSuccess: () => setNewLesson({ title: '', videoUrl: '', duration: 0 }) },
              );
            }}
            className="mt-4 grid grid-cols-1 md:grid-cols-[2fr_2fr_100px_auto] gap-2"
          >
            <input value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} placeholder="Título lección" className="ink-input text-sm" />
            <input value={newLesson.videoUrl} onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })} placeholder="URL video (opcional)" className="ink-input text-sm" />
            <input type="number" min={0} value={newLesson.duration} onChange={(e) => setNewLesson({ ...newLesson, duration: +e.target.value })} placeholder="Seg" className="ink-input text-sm" />
            <button type="submit" disabled={add.isPending} className="text-[10px] uppercase tracking-[0.28em] border border-ink-900/20 hover:border-ink-900 px-4 cursor-pointer disabled:opacity-50">
              + Lección
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

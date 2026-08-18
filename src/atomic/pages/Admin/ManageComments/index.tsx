import { Link, useSearchParams } from 'react-router-dom';
import { useCourses } from '@hooks/useCourses';

export default function ManageComments() {
  const [params] = useSearchParams();
  const courseId = params.get('course') ?? '';
  const { data } = useCourses({ status: '', includeAll: true });
  const courses = data?.data ?? [];
  const selected = courses.find((course) => String(course._id || course.id) === courseId);

  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/admin/cursos" className="mb-3 inline-flex min-h-9 items-center text-xs text-ink-500 hover:text-ink-900">← Volver a cursos</Link>
      <h1 className="font-serif text-4xl text-ink-900">Comentarios</h1>
      <section className="mt-7 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="border-b border-ink-900/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-5 text-sm"><button type="button" className="min-h-10 cursor-pointer border-b-2 border-ink-900 font-semibold">No leídos</button><button type="button" className="min-h-10 cursor-pointer border-b-2 border-transparent text-ink-500">Leídos</button><button type="button" className="min-h-10 cursor-pointer border-b-2 border-transparent text-ink-500">Eliminados</button></div>
            <select value={courseId} onChange={(event) => window.location.assign(`/admin/comentarios?course=${event.target.value}`)} className="min-h-11 min-w-60 rounded-lg border border-ink-900/20 bg-white px-3 text-sm"><option value="">Todos los cursos</option>{courses.map((course) => <option key={String(course._id || course.id)} value={String(course._id || course.id)}>{course.title}</option>)}</select>
          </div>
          <label className="relative mt-6 block"><span className="sr-only">Buscar comentarios</span><input placeholder="Buscar comentarios..." className="min-h-11 w-full rounded-lg border border-ink-900/20 px-4 text-sm outline-none focus:border-ink-900" /></label>
          <div className="mt-6 flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" className="accent-ink-900" /> Seleccionar todos</label><strong>0 comentarios</strong></div>
        </div>
        <div className="flex min-h-56 flex-col items-center justify-center p-8 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-300 text-ink-900"><CommentIcon /></div><p className="mt-4 text-sm text-ink-500">No hay comentarios{selected ? ` en “${selected.title}”` : ''}.</p></div>
      </section>
    </div>
  );
}

function CommentIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6"><path d="M20 11.5a8 8 0 0 1-10.8 7.5L4 20l1-4.5A8 8 0 1 1 20 11.5Z" strokeLinejoin="round" /></svg>; }

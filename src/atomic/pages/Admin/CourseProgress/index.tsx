import { Link, useParams } from 'react-router-dom';
import { useCourseAdmin } from '@hooks/useCourses';
import { useModules } from '@hooks/useModules';

export default function CourseProgress() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourseAdmin(id);
  const { data: modules = [] } = useModules(id);

  if (isLoading) return <p className="text-sm text-ink-500">Cargando avance…</p>;
  if (!course) return <p className="text-sm text-ink-500">Curso no encontrado.</p>;

  const totalLessons = modules.reduce((sum, module) => sum + (module.lessons?.length ?? module.lessonIds?.length ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/admin/cursos" className="mb-3 inline-flex min-h-9 items-center text-xs text-ink-500 hover:text-ink-900">← Volver a cursos</Link>
          <h1 className="font-serif text-3xl text-ink-900 md:text-4xl">Avance del producto: {course.title}</h1>
          <p className="mt-2 text-sm text-ink-500">Vista de la experiencia y progreso de los estudiantes.</p>
        </div>
        <div className="flex gap-2"><button type="button" onClick={() => window.print()} className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-4 text-sm hover:border-ink-900">Imprimir</button><button type="button" onClick={() => downloadProgress(course.title, course.enrolledCount ?? 0, totalLessons)} className="min-h-11 cursor-pointer rounded-full border border-ink-900/20 px-4 text-sm hover:border-ink-900">Exportar</button></div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="flex min-h-52 flex-col items-center justify-center bg-ink-900 px-6 py-10 text-center text-cream">
          <h2 className="font-serif text-3xl uppercase tracking-wide md:text-4xl">{course.title}</h2>
          <Link to={`/cursos/${course.slug}`} target="_blank" className="mt-7 inline-flex min-h-11 items-center bg-cream px-7 text-xs font-bold uppercase tracking-[0.12em] text-ink-900">Iniciar entrenamiento</Link>
        </div>
        <div className="grid gap-6 bg-cream-50 p-6 md:grid-cols-[1fr_280px] md:p-10">
          <div className="rounded-xl bg-white p-6">
            <h3 className="font-serif text-xl text-ink-900">{course.title}</h3>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex aspect-video w-28 items-center justify-center overflow-hidden rounded-lg bg-cream-200">{course.thumbnail ? <img src={course.thumbnail} alt="" className="h-full w-full object-cover" /> : <ImageIcon />}</div>
              <p className="text-sm font-semibold text-ink-900">{course.shortDescription || course.title}</p>
            </div>
          </div>
          <aside className="overflow-hidden rounded-xl bg-white">
            <div className="aspect-video bg-cream-200">{course.thumbnail && <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />}</div>
            <div className="p-5"><p className="text-sm font-semibold text-ink-900">0 de {totalLessons} lecciones completadas</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-900/10"><div className="h-full w-0 bg-ink-900" /></div><p className="mt-4 text-xs text-ink-500">{course.enrolledCount ?? 0} miembro{course.enrolledCount === 1 ? '' : 's'} inscrito{course.enrolledCount === 1 ? '' : 's'}</p></div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function downloadProgress(title: string, members: number, lessons: number) {
  const content = `Curso,Miembros,Lecciones\n"${title.replace(/"/g, '""')}",${members},${lessons}\n`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `avance-${title.toLocaleLowerCase('es').replace(/ /g, '-')}.csv`; link.click(); URL.revokeObjectURL(url);
}

function ImageIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-ink-300"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m4 18 5-5 3 3 2-2 6 5" /></svg>; }

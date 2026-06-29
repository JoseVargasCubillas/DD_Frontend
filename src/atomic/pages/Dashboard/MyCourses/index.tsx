import { Link } from 'react-router-dom';
import { useCourses } from '@hooks/useCourses';

export default function MyCourses() {
  const { data, isLoading } = useCourses();
  const courses = data?.data ?? [];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Tu biblioteca</p>
        <h1 className="font-serif text-4xl text-ink-900">Mis cursos</h1>
        <p className="font-serif italic text-ink-600 mt-1">
          {courses.length} {courses.length === 1 ? 'curso disponible' : 'cursos disponibles'} en tu cuenta.
        </p>
      </header>
      <div className="h-px bg-ink-900/30" />

      {isLoading && <p className="text-ink-600 font-serif italic">Cargando…</p>}
      {!isLoading && courses.length === 0 && (
        <p className="text-ink-600 font-serif italic">
          Aún no tienes cursos asignados. Si compraste uno y no lo ves, escribe a{' '}
          <a href="mailto:academia@diegodiaz.mx" className="underline decoration-ink-900/40 hover:decoration-ink-900 text-ink-900">
            academia@diegodiaz.mx
          </a>.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((c) => (
          <Link
            key={c.id ?? c._id}
            to={`/cursos/${c.slug}`}
            className="group block bg-cream-100 border border-ink-900/15 hover:border-ink-900 transition-colors cursor-pointer"
          >
            {c.thumbnail && (
              <div className="aspect-[16/10] bg-cream-200 overflow-hidden">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink-700">{c.category}</p>
              <h3 className="font-serif text-xl text-ink-900 mt-2 leading-snug">{c.title}</h3>
              <p className="font-serif italic text-ink-600 text-sm mt-2 line-clamp-2">
                {c.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


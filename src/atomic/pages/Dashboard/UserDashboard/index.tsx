import { Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useCourses } from '@hooks/useCourses';

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useCourses({ limit: 6 });
  const courses = data?.data ?? [];

  return (
    <div className="space-y-12">
      {/* Hero editorial */}
      <section>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-3">Portada · Tu academia</p>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-ink-900 leading-[1] tracking-tight">
          Buen día, <span className="italic">{user?.name?.split(' ')[0] ?? 'lector'}</span>.
        </h1>
        <p className="font-serif text-ink-700 text-lg max-w-2xl mt-4">
          Continúa tu lectura donde la dejaste, explora nuevos cursos y mantente al día
          con la edición que el equipo editorial preparó para ti.
        </p>
        <div className="h-px bg-ink-900/30 mt-8" />
      </section>

      {/* Continuar viendo */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-ink-700">Continúa donde lo dejaste</h2>
          <Link to="/mi-cuenta/cursos" className="text-[10px] uppercase tracking-[0.3em] text-ink-700 hover:text-ink-900">
            Ver todos →
          </Link>
        </div>
        <div className="h-px bg-ink-900/20 mb-5" />

        {isLoading && <p className="text-ink-600 font-serif italic">Cargando ediciones…</p>}
        {!isLoading && courses.length === 0 && (
          <p className="text-ink-600 font-serif italic">
            Aún no estás inscrito en ningún curso. Contacta a redacción para obtener acceso.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.slice(0, 3).map((c) => (
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
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-900 mt-4 group-hover:tracking-[0.42em] transition-all">
                  Continuar →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Otras secciones del periódico */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-cream-100 border border-ink-900/15 p-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-3">Editorial</p>
          <div className="h-px bg-ink-900/20 mb-4" />
          <h3 className="font-serif text-2xl text-ink-900 mb-2">El ejercicio fiscal de este mes</h3>
          <p className="font-serif italic text-ink-600">
            Lee la columna editorial donde Diego analiza los cambios fiscales más recientes.
          </p>
          <Link to="/blog" className="inline-block mt-4 text-[10px] uppercase tracking-[0.3em] text-ink-900 hover:tracking-[0.42em] transition-all">
            Ir al blog →
          </Link>
        </div>
        <div className="bg-cream-100 border border-ink-900/15 p-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-3">Agenda</p>
          <div className="h-px bg-ink-900/20 mb-4" />
          <h3 className="font-serif text-2xl text-ink-900 mb-2">Próximos eventos en vivo</h3>
          <p className="font-serif italic text-ink-600">
            Reserva tu lugar en los seminarios y talleres de la temporada.
          </p>
          <Link to="/eventos" className="inline-block mt-4 text-[10px] uppercase tracking-[0.3em] text-ink-900 hover:tracking-[0.42em] transition-all">
            Ver eventos →
          </Link>
        </div>
      </section>
    </div>
  );
}


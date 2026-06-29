import { useCourses } from '@hooks/useCourses';
import { useUsers } from '@hooks/useUsers';
import { useEvents } from '@hooks/useEvents';
import { Link } from 'react-router-dom';

interface KpiProps { label: string; value: string | number; meta?: string; loading?: boolean }

function Kpi({ label, value, meta, loading }: KpiProps) {
  return (
    <div className="bg-cream-100 border border-ink-900/15 p-6">
      <p className="text-[10px] uppercase tracking-[0.32em] text-ink-700 mb-3">{label}</p>
      <p className="font-serif text-4xl text-ink-900 leading-none mb-2">
        {loading ? '—' : value}
      </p>
      {meta && <p className="text-xs text-ink-600 font-serif italic">{meta}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: courses, isLoading: l1 } = useCourses();
  const { data: users, isLoading: l2 } = useUsers({ limit: 1 });
  const { data: events, isLoading: l3 } = useEvents();

  return (
    <div className="space-y-10">
      {/* Headline editorial */}
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-3">Portada · Edición de hoy</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-ink-900 leading-tight">
          Buenos días, <span className="italic">redactor</span>.
        </h1>
        <p className="font-serif text-ink-600 mt-2 max-w-2xl">
          Aquí está el resumen de tu sala de redacción: cursos publicados, suscriptores
          activos y eventos por venir.
        </p>
        <div className="h-px bg-ink-900/30 mt-6" />
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Cursos"       value={courses?.pagination?.total ?? courses?.data?.length ?? 0} meta="publicados + borradores" loading={l1} />
        <Kpi label="Suscriptores" value={users?.pagination?.total ?? 0}  meta="cuentas activas" loading={l2} />
        <Kpi label="Eventos"      value={events?.pagination?.total ?? events?.data?.length ?? 0} meta="agenda actual" loading={l3} />
        <Kpi label="Editorial"    value="—" meta="próximamente" />
      </section>

      {/* Accesos rápidos */}
      <section>
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-4">Atajos de redacción</h2>
        <div className="h-px bg-ink-900/20 mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: '/admin/cursos',    title: 'Publicar curso',         desc: 'Sube videos, módulos y temarios.' },
            { to: '/admin/usuarios',  title: 'Dar acceso a un cliente',desc: 'Crea cuenta y envía credenciales por correo.' },
            { to: '/admin/eventos',   title: 'Programar evento',       desc: 'Seminarios, talleres y webinars.' },
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group block bg-cream-100 border border-ink-900/15 p-6 hover:border-ink-900 transition-colors cursor-pointer"
            >
              <p className="text-[10px] uppercase tracking-[0.32em] text-ink-700">Sección</p>
              <h3 className="font-serif text-xl text-ink-900 mt-2">{c.title}</h3>
              <p className="font-serif text-sm text-ink-600 mt-2">{c.desc}</p>
              <p className="text-[10px] uppercase tracking-[0.32em] text-ink-900 mt-4 group-hover:tracking-[0.42em] transition-all">
                Ir → 
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Últimos cursos */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-ink-700">Cursos recientes</h2>
          <Link to="/admin/cursos" className="text-[10px] uppercase tracking-[0.3em] text-ink-700 hover:text-ink-900">
            Ver todos →
          </Link>
        </div>
        <div className="h-px bg-ink-900/20 mb-5" />
        <ul className="divide-y divide-ink-900/10 bg-cream-100 border border-ink-900/15">
          {(courses?.data ?? []).slice(0, 5).map((c) => (
            <li key={c.id ?? c._id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-serif text-ink-900 truncate">{c.title}</p>
                <p className="text-xs text-ink-600 font-serif italic">{c.category} · {c.status}</p>
              </div>
              <span className="text-sm text-ink-700 font-serif">${c.price}</span>
            </li>
          ))}
          {!l1 && (!courses?.data || courses.data.length === 0) && (
            <li className="px-5 py-8 text-center text-ink-600 font-serif italic">Aún no hay cursos publicados.</li>
          )}
        </ul>
      </section>
    </div>
  );
}


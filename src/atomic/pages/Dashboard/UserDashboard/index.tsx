import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@store/authStore';
import { fetchProducts } from '@utils/mock-data';

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  const featured = products[0];
  const groups = [
    { title: 'Capacitaciones · Temas Especializados', items: products.slice(0, 3) },
    { title: 'Entrevistas con los Expertos',          items: products.slice(2, 5) },
    { title: 'Otras Capacitaciones',                   items: products.slice(3, 7) },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero academia */}
      <section className="bg-cream-50 border-b border-cream-300">
        <div className="container-app py-12 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <div className="aspect-[4/5] bg-ink-900 flex items-center justify-center text-white">
              <span className="font-heading text-4xl tracking-wider">RETRATO</span>
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="section-label text-ink-500">Bienvenido, {user?.name?.split(' ')[0] ?? 'colega'}</p>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-brand-700 mt-3 leading-none">ACADEMIA</h1>
            <p className="font-serif text-lg mt-6 leading-relaxed text-ink-700">
              La plataforma de streaming especializada que pone a tu alcance cientos de lecciones en
              video impartidas por los mejores expertos fiscales y contables del país.
            </p>
            <p className="font-serif text-lg mt-4 leading-relaxed text-ink-700">
              Planificación fiscal, contabilidad empresarial, obligaciones tributarias, auditorías,
              finanzas corporativas, cumplimiento normativo, estrategias de optimización fiscal y más.
            </p>
            <p className="font-serif text-base italic mt-4 text-ink-500">
              Las lecciones están disponibles en cualquier momento y lugar, desde tu smartphone o computadora.
            </p>
          </div>
        </div>
      </section>

      {/* Continue watching */}
      {featured && (
        <section className="container-app py-8 border-b border-cream-300">
          <div className="flex items-center gap-6">
            <div>
              <p className="section-label text-brand-600">Iniciar entrenamiento</p>
              <p className="font-medium mt-1">MÓDULO 1 — Carta Porte</p>
            </div>
            <Link to={`/mi-cuenta/cursos/${featured.id}`} className="ml-auto md:ml-0 flex items-center gap-3 group">
              <div className="w-32 h-20 bg-ink-900 text-white flex items-center justify-center text-[10px] font-bold tracking-wider text-center p-1">
                ¿QUÉ ES EL COMPLEMENTO CARTA PORTE?
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-ink-500 group-hover:text-ink-900 transition-colors">Continuar →</span>
            </Link>
          </div>
        </section>
      )}

      {/* Course rows */}
      <div className="container-app py-10 flex flex-col gap-14">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-700 uppercase tracking-wider mb-6">{g.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <p className="text-ink-500 text-sm">Cargando…</p>
              ) : g.items.map((p) => (
                <Link key={p.id} to={`/mi-cuenta/cursos/${p.id}`} className="bg-white border border-cream-300 hover:border-ink-900 transition-colors group">
                  <div className="aspect-video bg-ink-900 text-white flex items-center justify-center">
                    <span className="font-heading text-2xl tracking-wider px-4 text-center">{p.title}</span>
                  </div>
                  <div className="p-5">
                    <p className="font-medium uppercase tracking-wider text-sm">{p.title}</p>
                    <button className="btn-primary mt-4 text-[10px] py-2.5 w-full">Iniciar entrenamiento</button>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}


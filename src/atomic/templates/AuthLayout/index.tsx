import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900 flex flex-col">
      {/* Masthead — cabecera de periódico */}
      <header className="border-b-2 border-ink-900 bg-cream-50">
        <div className="container-app py-4 flex items-center justify-between">
          <span className="section-label hidden sm:inline">{today}</span>
          <Link to="/" className="text-center flex flex-col">
            <span className="font-heading font-bold tracking-widest3 text-2xl md:text-3xl">DIEGO DÍAZ</span>
            <span className="font-serif italic text-[11px] tracking-[0.25em] text-ink-500 mt-0.5">ESTRATEGA FISCAL · ACADEMIA</span>
          </Link>
          <span className="section-label hidden sm:inline">Vol. MMXXVI</span>
        </div>
        <div className="border-t border-ink-300 bg-ink-900 text-white">
          <div className="container-app py-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.35em]">
            <span>Acceso restringido</span>
            <span className="hidden md:inline">Edición digital — Miembros</span>
            <span>Sesión</span>
          </div>
        </div>
      </header>

      {/* Two-column editorial layout */}
      <main className="flex-1 container-app py-10 md:py-16 grid md:grid-cols-12 gap-10 md:gap-14">
        {/* Columna editorial izquierda */}
        <aside className="hidden md:flex md:col-span-6 lg:col-span-7 flex-col gap-8 border-r border-ink-300 pr-10 lg:pr-14">
          <p className="section-label">Editorial · Sección Académica</p>
          <h1 className="font-heading text-5xl lg:text-6xl leading-[0.95] tracking-tight">
            Una academia para
            <span className="font-serif italic font-normal block mt-2">quienes deciden</span>
            <span className="block mt-2">dejar de improvisar.</span>
          </h1>
          <p className="font-serif text-lg leading-relaxed text-ink-600 first-letter:font-bold first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:font-heading">
            La biblioteca completa de capacitaciones de Diego Díaz — estrategia fiscal,
            holding patrimonial, optimización corporativa — disponible bajo demanda. Cada
            suscripción abre el archivo durante el período contratado.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ink-300">
            <div>
              <p className="font-heading text-3xl font-bold">+9k</p>
              <p className="section-label mt-1">Suscriptores</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold">120h</p>
              <p className="section-label mt-1">Contenido</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-bold">18</p>
              <p className="section-label mt-1">Programas</p>
            </div>
          </div>
        </aside>

        {/* Columna formulario derecha */}
        <section className="md:col-span-6 lg:col-span-5 flex flex-col justify-center">
          <Outlet />
        </section>
      </main>

      <footer className="border-t border-ink-300 bg-cream-50">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-400">
          <span>© {new Date().getFullYear()} Diego Díaz · Estratega Fiscal</span>
          <span>Acceso solo con credenciales emitidas por administración</span>
        </div>
      </footer>
    </div>
  );
}


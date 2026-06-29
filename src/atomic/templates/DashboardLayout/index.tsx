import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import logoDD from '../../../../assets/home/012_home_main logo_DD.png';

const MENU = [
  { to: '/mi-cuenta',         label: 'Edición de hoy', end: true },
  { to: '/mi-cuenta/cursos',  label: 'Mis cursos' },
  { to: '/mi-cuenta/perfil',  label: 'Perfil' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream text-ink-900 flex flex-col">
      {/* ── Masthead superior ─────────────────────────── */}
      <header className="bg-cream-100 border-b border-ink-900/20">
        <div className="container-app flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoDD} alt="Diego Díaz" className="h-10 object-contain" />
            <div className="hidden md:block border-l border-ink-900/20 pl-3">
              <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700">Academia</p>
              <p className="font-serif italic text-sm text-ink-600">edición del lector</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden lg:inline text-[10px] uppercase tracking-[0.32em] text-ink-600 capitalize">
              {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long' })}
            </span>
            {user && (
              <div className="flex items-center gap-2.5 border-l border-ink-900/20 pl-4">
                <div className="w-8 h-8 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-[10px] uppercase tracking-[0.28em] text-ink-600 hover:text-ink-900 transition-colors cursor-pointer ml-2"
                >
                  Salir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reglas dobles tipo periódico */}
        <div className="container-app">
          <div className="h-px bg-ink-900/40 mb-0.5" />
          <div className="h-px bg-ink-900/20" />
        </div>

        {/* Tabs de navegación */}
        <nav className="container-app flex items-center gap-8 py-3 overflow-x-auto">
          {MENU.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-[0.32em] py-2 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-ink-900 text-ink-900 font-semibold'
                    : 'border-transparent text-ink-600 hover:text-ink-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 container-app py-10">
        <Outlet />
      </main>

      <footer className="border-t border-ink-900/15 bg-cream-200/60">
        <div className="container-app py-4 flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-ink-600">
          <span>© Diego Díaz · Academia</span>
          <span>Edición Digital</span>
        </div>
      </footer>
    </div>
  );
}


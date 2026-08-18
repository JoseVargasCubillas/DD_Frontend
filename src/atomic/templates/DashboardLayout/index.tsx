import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Navbar from '@organisms/Navbar';
import Footer from '@organisms/Footer';

const MENU = [
  { to: '/mi-cuenta', label: 'Edicion de hoy', end: true },
  { to: '/mi-cuenta/cursos', label: 'Mis cursos' },
  { to: '/mi-cuenta/perfil', label: 'Perfil' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink-900">
      <Navbar />

      <div className="border-b border-ink-900/15 bg-cream-100">
        <nav className="container-app flex items-center justify-between gap-8 overflow-x-auto py-3">
          <div className="flex items-center gap-8">
            {MENU.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap border-b-2 py-2 text-[11px] uppercase tracking-[0.32em] transition-colors ${
                    isActive
                      ? 'border-ink-900 font-semibold text-ink-900'
                      : 'border-transparent text-ink-600 hover:text-ink-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {user && (
            <div className="flex items-center gap-2.5 border-l border-ink-900/20 pl-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 font-serif text-sm text-cream">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium sm:block">{user.name.split(' ')[0]}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="ml-2 cursor-pointer whitespace-nowrap text-[10px] uppercase tracking-[0.28em] text-ink-600 transition-colors hover:text-ink-900"
              >
                Salir
              </button>
            </div>
          )}
        </nav>
      </div>

      <main className="container-app flex-1 py-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

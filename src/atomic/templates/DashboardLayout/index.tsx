import { Outlet, NavLink, useNavigate, ScrollRestoration } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Navbar from '@organisms/Navbar';
import Footer from '@organisms/Footer';

const MENU = [
  { to: '/mi-cuenta/cursos', label: 'Mis cursos' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink-900">
      <ScrollRestoration />
      <Navbar />

      <div className="border-b border-ink-900/15 bg-cream-100">
        <nav className="container-app flex items-center justify-between gap-4 overflow-x-auto py-3">
          <div className="flex items-center gap-8">
            {MENU.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
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
            <div className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-ink-900/15 bg-white px-2 py-1 shadow-[0_14px_34px_rgba(10,10,10,0.06)]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 font-serif text-sm text-cream">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <NavLink
                to="/mi-cuenta/perfil"
                className={({ isActive }) =>
                  `hidden rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors sm:block ${
                    isActive ? 'bg-cream-200 text-ink-900' : 'text-ink-600 hover:bg-cream-100 hover:text-ink-900'
                  }`
                }
              >
                Perfil
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-ink-600 transition-colors hover:bg-ink-900 hover:text-white"
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

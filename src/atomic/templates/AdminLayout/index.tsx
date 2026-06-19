import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import logoDD from '../../../../assets/home/012_home_main logo_DD.png';

interface MenuItem { to: string; label: string; group: string; end?: boolean }

const MENU: MenuItem[] = [
  { to: '/admin',             label: 'Inicio',       group: 'General', end: true },
  { to: '/admin/cursos',      label: 'Cursos',       group: 'Academia' },
  { to: '/admin/paquetes',    label: 'Paquetes',     group: 'Academia' },
  { to: '/admin/promociones', label: 'Promociones',  group: 'Academia' },
  { to: '/admin/eventos',     label: 'Eventos',      group: 'Academia' },
  { to: '/admin/blog',        label: 'Blog',         group: 'Academia' },
  { to: '/admin/contactos',   label: 'Contactos',    group: 'Comunidad' },
  { to: '/admin/etiquetas',   label: 'Etiquetas',    group: 'Comunidad' },
];

const GROUPS = ['General', 'Academia', 'Comunidad'] as const;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream text-ink-900 flex">
      {/* ── Sidebar editorial ─────────────────────────── */}
      <aside className="w-64 shrink-0 bg-cream-100 border-r border-ink-900/15 flex flex-col">
        {/* Masthead */}
        <Link to="/" className="px-6 py-6 border-b border-ink-900/15 block">
          <img src={logoDD} alt="Diego Díaz" className="h-9 object-contain mb-2" />
          <p className="text-[9px] uppercase tracking-[0.4em] text-ink-700">
            Panel admin
          </p>
        </Link>

        {/* Navegación agrupada */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {GROUPS.map((group) => (
            <div key={group} className="mb-6">
              <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.4em] text-ink-500">
                {group}
              </p>
              <ul className="flex flex-col gap-0.5">
                {MENU.filter((m) => m.group === group).map(({ to, label, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      className={({ isActive }) =>
                        `block px-3 py-2 text-[12px] uppercase tracking-[0.18em] transition-colors border-l-2 ${
                          isActive
                            ? 'border-ink-900 bg-cream-200 text-ink-900 font-semibold'
                            : 'border-transparent text-ink-600 hover:text-ink-900 hover:bg-cream-200/60'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="border-t border-ink-900/15 px-4 py-4">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink-900 truncate">{user.name}</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full text-[10px] uppercase tracking-[0.28em] text-ink-600 hover:text-ink-900 transition-colors py-2 border border-ink-900/20 hover:border-ink-900 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido ─────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-ink-900/15 px-8 py-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700">
            Panel admin · {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-600">En línea</span>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


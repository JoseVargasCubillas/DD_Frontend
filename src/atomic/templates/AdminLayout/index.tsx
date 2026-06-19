import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useAuth } from '@hooks/useAuth';
import Avatar from '@atoms/Avatar';

type Item = { to: string; label: string; end?: boolean };
type Section = { title: string; items: Item[] };

const SECTIONS: Section[] = [
  { title: 'General', items: [
    { to: '/admin', label: 'Dashboard', end: true },
  ]},
  { title: 'Academia', items: [
    { to: '/admin/productos', label: 'Productos' },
    { to: '/admin/ofertas', label: 'Ofertas' },
    { to: '/admin/suscripciones', label: 'Suscripciones' },
    { to: '/admin/media', label: 'Media library' },
  ]},
  { title: 'Comunidad', items: [
    { to: '/admin/contactos', label: 'Contactos' },
    { to: '/admin/usuarios', label: 'Cuentas' },
    { to: '/admin/eventos', label: 'Eventos' },
    { to: '/admin/blog', label: 'Blog' },
  ]},
  { title: 'Sistema', items: [
    { to: '/admin/configuracion', label: 'Configuración' },
  ]},
];

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900 flex">
      {/* Sidebar editorial */}
      <aside className="w-64 shrink-0 bg-ink-900 text-white flex flex-col border-r border-ink-700">
        <div className="px-5 py-5 border-b border-ink-700">
          <Link to="/" className="flex flex-col">
            <span className="font-heading font-bold tracking-widest3 text-lg">DIEGO DÍAZ</span>
            <span className="font-serif italic text-[10px] tracking-[0.25em] text-ink-300 mt-0.5">PANEL ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {SECTIONS.map((sec) => (
            <div key={sec.title} className="mb-5">
              <p className="px-5 mb-2 text-[10px] uppercase tracking-[0.3em] text-ink-400 font-semibold">{sec.title}</p>
              <div className="flex flex-col">
                {sec.items.map(({ to, label, end }) => (
                  <NavLink key={to} to={to} end={end}
                    className={({ isActive }) => `mx-2 px-3 py-2 text-sm rounded transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white text-ink-900 font-semibold'
                        : 'text-ink-200 hover:bg-ink-800 hover:text-white'
                    }`}>
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-ink-700 p-4 flex items-center gap-3">
          {user && <Avatar name={user.name} size="sm" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name ?? 'Admin'}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400 truncate">{user?.email}</p>
          </div>
          <button onClick={logout} title="Cerrar sesión"
            className="cursor-pointer text-ink-300 hover:text-white p-1.5 rounded hover:bg-ink-800 transition-colors"
            aria-label="Cerrar sesión">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


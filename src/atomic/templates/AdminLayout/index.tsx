import { Outlet, NavLink, Link } from 'react-router-dom';

const MENU = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/cursos', label: 'Cursos', end: false },
  { to: '/admin/usuarios', label: 'Usuarios', end: false },
  { to: '/admin/eventos', label: 'Eventos', end: false },
  { to: '/admin/blog', label: 'Blog', end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      <aside className="w-56 bg-dark-800 border-r border-dark-600 flex flex-col">
        <div className="px-5 py-5 border-b border-dark-600">
          <Link to="/" className="font-heading font-bold text-xl text-white">Diego<span className="text-brand-500">Díaz</span></Link>
          <p className="text-xs text-gray-500 mt-0.5">Panel Admin</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {MENU.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
    </div>
  );
}

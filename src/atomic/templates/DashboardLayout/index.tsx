import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import Avatar from '@atoms/Avatar';

const MENU = [
  { to: '/mi-cuenta', label: 'Resumen', end: true },
  { to: '/mi-cuenta/cursos', label: 'Mis cursos', end: false },
  { to: '/mi-cuenta/perfil', label: 'Perfil', end: false },
];

export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <header className="bg-dark-800 border-b border-dark-600 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-heading font-bold text-xl text-white">Diego<span className="text-brand-500">Díaz</span></Link>
        {user && <div className="flex items-center gap-2"><Avatar name={user.name} size="sm" /><span className="text-sm text-gray-300 hidden sm:block">{user.name}</span></div>}
      </header>
      <div className="flex flex-1 container-app py-8 gap-8">
        <aside className="hidden md:flex flex-col gap-1 w-48 shrink-0">
          {MENU.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}>
              {label}
            </NavLink>
          ))}
        </aside>
        <main className="flex-1 min-w-0"><Outlet /></main>
      </div>
    </div>
  );
}

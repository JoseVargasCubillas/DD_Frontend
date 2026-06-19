import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useAuth } from '@hooks/useAuth';
import Avatar from '@atoms/Avatar';

const MENU = [
  { to: '/mi-cuenta',         label: 'Dashboard', end: true  },
  { to: '/mi-cuenta/cursos',  label: 'Mis cursos', end: false },
  { to: '/mi-cuenta/perfil',  label: 'Perfil',     end: false },
];

export default function DashboardLayout() {
  const user = useAuthStore((s) => s.user);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-cream-100 text-ink-900 flex flex-col">
      <header className="bg-ink-900 text-white border-b border-ink-700">
        <div className="container-app py-3 flex items-center justify-between gap-6">
          <Link to="/mi-cuenta" className="flex flex-col shrink-0">
            <span className="font-heading font-bold tracking-widest3 text-lg">DIEGO DÍAZ</span>
            <span className="font-serif italic text-[10px] tracking-[0.25em] text-ink-300 -mt-0.5">ACADEMIA</span>
          </Link>

          <div className="relative flex-1 max-w-2xl hidden md:block">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/mi-cuenta/cursos?q=${encodeURIComponent(search)}`)}
              placeholder="¿Qué estás buscando?"
              className="w-full bg-ink-800 border border-ink-700 px-10 py-2 text-sm placeholder-ink-400 focus:outline-none focus:border-white transition-colors" />
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <nav className="hidden md:flex items-center gap-5 text-xs uppercase tracking-[0.2em] text-ink-300">
              {MENU.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'text-white' : 'hover:text-white transition-colors'}>{label}</NavLink>
              ))}
            </nav>
            {user && <Avatar name={user.name} size="sm" />}
            <button onClick={logout} className="text-xs uppercase tracking-[0.2em] text-ink-300 hover:text-white cursor-pointer transition-colors">Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>
    </div>
  );
}


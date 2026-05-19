import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import Avatar from '@atoms/Avatar';
import Button from '@atoms/Button';

const NAV_LINKS = [
  { to: '/acerca', label: 'Acerca' },
  { to: '/cursos', label: 'Cursos' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/academia', label: 'Academia' },
  { to: '/blog', label: 'Blog' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  return (
    <nav className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
      <div className="container-app flex items-center justify-between h-16">
        <Link to="/" className="font-heading font-black text-xl text-white" onClick={closeMobileMenu}>
          Diego<span className="text-brand-500">Díaz</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? 'text-brand-400' : 'text-gray-300 hover:text-white'}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link to="/mi-cuenta" className="flex items-center gap-2 hover:opacity-80">
                <Avatar name={user.name} size="sm" />
                <span className="text-sm text-gray-300">{user.name}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
            </div>
          ) : (
            <>
              <Link to="/iniciar-sesion"><Button variant="ghost" size="sm">Ingresar</Button></Link>
              <Link to="/registro"><Button size="sm">Registrarse</Button></Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-white p-2" onClick={toggleMobileMenu} aria-label="Menú">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-dark-800 border-t border-dark-600 py-4 px-4 flex flex-col gap-3">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className="text-gray-300 hover:text-white py-2 text-sm font-medium" onClick={closeMobileMenu}>
              {label}
            </NavLink>
          ))}
          <div className="border-t border-dark-600 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" fullWidth onClick={() => { logout(); closeMobileMenu(); }}>Cerrar sesión</Button>
            ) : (
              <>
                <Link to="/iniciar-sesion" onClick={closeMobileMenu}><Button variant="secondary" size="sm" fullWidth>Ingresar</Button></Link>
                <Link to="/registro" onClick={closeMobileMenu}><Button size="sm" fullWidth>Registrarse</Button></Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

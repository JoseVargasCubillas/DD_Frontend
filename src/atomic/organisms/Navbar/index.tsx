import { Link, NavLink } from 'react-router-dom';
import { useUIStore } from '@store/uiStore';
import logoDD from '../../../../assets/012_home_main logo_DD.png';

const NAV_LINKS = [
  { to: '/acerca',   label: 'Diego' },
  { to: '/eventos',  label: 'Eventos' },
  { to: '/academia', label: 'Academia' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/contacto', label: 'Diaz Lara ↓' },
];

export default function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();

  return (
    <>
      {/* ── Barra superior negra ─────────────────── */}
      <div className="bg-ink-900 py-2.5">
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.25em] text-ink-300">
            <span className="text-white">Estrategia Fiscal</span>
            <span className="text-ink-500">·</span>
            <span>Próximo Evento</span>
            <span className="text-ink-500">·</span>
            <span>15-Junio</span>
            <span className="text-ink-500">·</span>
            <span>CDMX</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.25em] text-ink-300">
            <span>ES / EN</span>
            <Link
              to="/academia"
              className="hover:text-white transition-colors"
            >
              Acceder a Academia →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Navbar principal (cream) ──────────────── */}
      <nav className="bg-cream-200 border-b border-cream-400 sticky top-0 z-50">
        <div className="container-app flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0">
            <img src={logoDD} alt="Diego Díaz" className="h-12 object-contain" />
          </Link>

          {/* Nav links (desktop) */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-sans transition-colors ${
                      isActive
                        ? 'text-ink-900 font-semibold'
                        : 'text-ink-500 hover:text-ink-900'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <Link to="/eventos" className="hidden lg:inline-flex btn-primary text-[10px] py-3 px-6">
              Próximo Evento →
            </Link>
            <button
              className="lg:hidden text-ink-900 p-2"
              onClick={toggleMobileMenu}
              aria-label="Menú"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-cream-200 border-t border-cream-400 py-4 px-6 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="text-ink-600 hover:text-ink-900 py-2.5 text-sm border-b border-cream-300 last:border-0"
                onClick={closeMobileMenu}
              >
                {label}
              </NavLink>
            ))}
            <Link to="/eventos" className="btn-primary mt-4 justify-center" onClick={closeMobileMenu}>
              Próximo Evento →
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

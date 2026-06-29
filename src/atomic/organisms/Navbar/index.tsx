import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUIStore } from '@store/uiStore';
import { useAuthStore } from '@store/authStore';
import logoDD from '../../../../assets/home/012_home_main logo_DD.png';

const NAV_LINKS: Array<{ to: string; label: string; external?: boolean }> = [
  { to: '/acerca',   label: 'Diego' },
  { to: '/eventos',  label: 'Eventos' },
  { to: '/academia', label: 'Academia' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/despacho', label: 'Díaz Lara' },
];

export default function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { user, isAuthenticated } = useAuthStore();
  const [compact, setCompact] = useState(false);

  const academyHref = isAuthenticated
    ? (user?.role === 'admin' ? '/admin' : '/mi-cuenta')
    : '/iniciar-sesion';
  const academyLabel = isAuthenticated ? 'Ir a mi panel →' : 'Acceder a Academia →';

  // Demo 06 — sticky nav compact on scroll
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── Barra superior cream ─────────────────── */}
      <div className="hidden md:block bg-cream-200 border-b border-cream-400 py-2">
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.25em] text-ink-500">
            <span>Estrategia Fiscal</span>
            <span className="text-ink-300">·</span>
            <span>Próximo Evento</span>
            <span className="text-ink-300">·</span>
            <span>15 Junio</span>
            <span className="text-ink-300">·</span>
            <span>CDMX</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.25em] text-ink-500">
            <span>ES / EN</span>
            <Link to={academyHref} className="hover:text-ink-900 transition-colors">
              {academyLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Navbar principal — Demo 06 compact ────── */}
      <nav className="bg-cream-200 border-b border-cream-400 sticky top-0 z-40">
        <div
          className={`container-app flex items-center justify-between transition-all duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
            compact ? 'h-[48px]' : 'h-[64px] lg:h-[72px]'
          }`}
        >
          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex-shrink-0">
            <img
              src={logoDD}
              alt="Diego Díaz"
              className={`object-contain transition-all duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                compact ? 'h-8' : 'h-10 lg:h-12'
              }`}
            />
          </Link>

          {/* Nav links (desktop) — Demo 09 underline grow */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label, external }) => (
              <li key={to}>
                {external ? (
                  <a
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-sans text-ink-500 hover:text-ink-900 link-grow transition-colors"
                  >
                    {label}
                  </a>
                ) : (
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `text-sm font-sans link-grow transition-colors ${
                        isActive
                          ? 'text-ink-900 font-semibold'
                          : 'text-ink-500 hover:text-ink-900'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-4">
            <Link to="/eventos" className="hidden lg:inline-flex btn-primary text-[11px] py-3 px-6">
              Próximo Evento →
            </Link>
            <button
              className="lg:hidden text-ink-900 p-3 -mr-3 min-w-11 min-h-11 flex items-center justify-center"
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
            {NAV_LINKS.map(({ to, label, external }) => (
              external ? (
                <a
                  key={to}
                  href={to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center text-sm text-ink-600 hover:text-ink-900 border-b border-cream-300 last:border-0"
                  onClick={closeMobileMenu}
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  key={to}
                  to={to}
                  className="flex min-h-[44px] items-center text-sm text-ink-600 hover:text-ink-900 border-b border-cream-300 last:border-0"
                  onClick={closeMobileMenu}
                >
                  {label}
                </NavLink>
              )
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

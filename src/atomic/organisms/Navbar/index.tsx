import { useState, useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUIStore } from '@store/uiStore';
import { useAuthStore } from '@store/authStore';
import { useEvents } from '@hooks/useEvents';
import {
  FALLBACK_CALENDAR_EVENTS,
  getNextUpcomingCalendarEvent,
  loadStoredCalendarEvents,
  mergeCalendarEventSources,
  type CalendarEventSummary,
} from '@utils/eventCalendar';
import logoDD from '../../../../assets/home/012_home_main logo_DD.png';

const NAV_LINKS: Array<{ to: string; label: string; external?: boolean }> = [
  { to: '/acerca',   label: 'Diego' },
  { to: '/eventos',  label: 'Eventos' },
  { to: '/academia', label: 'Academia' },
  { to: '/blog',     label: 'Blog' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/despacho', label: 'Díaz Lara' },
];

const formatTopEventDate = (value?: string) => {
  if (!value) return 'POR DEFINIR';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'POR DEFINIR';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
  })
    .format(date)
    .replace('.', '')
    .toUpperCase();
};

export default function Navbar() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { user, isAuthenticated } = useAuthStore();
  const [compact, setCompact] = useState(false);
  const [storedEvents, setStoredEvents] = useState<CalendarEventSummary[]>(
    loadStoredCalendarEvents,
  );
  const { data: eventsData } = useEvents({ limit: 100, status: 'upcoming' });

  const academyHref = isAuthenticated
    ? (user?.role === 'admin' ? '/admin' : '/mi-cuenta')
    : '/iniciar-sesion';
  const academyLabel = isAuthenticated ? 'Ir a mi panel →' : 'Acceder a Academia →';
  const nextEvent = useMemo(() => {
    const candidates = mergeCalendarEventSources(
      FALLBACK_CALENDAR_EVENTS,
      eventsData?.data ?? [],
      storedEvents,
    );
    return getNextUpcomingCalendarEvent(candidates) ?? FALLBACK_CALENDAR_EVENTS[0];
  }, [eventsData?.data, storedEvents]);
  const principalEventHref = '/eventos#evento-principal';
  const nextEventDate = formatTopEventDate(nextEvent?.startDate);
  const nextEventLocation = nextEvent?.location || 'Por definir';

  // Demo 06 — sticky nav compact on scroll
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const refreshStoredEvents = () => setStoredEvents(loadStoredCalendarEvents());
    window.addEventListener('storage', refreshStoredEvents);
    window.addEventListener('dd-events-updated', refreshStoredEvents);
    window.addEventListener('focus', refreshStoredEvents);
    return () => {
      window.removeEventListener('storage', refreshStoredEvents);
      window.removeEventListener('dd-events-updated', refreshStoredEvents);
      window.removeEventListener('focus', refreshStoredEvents);
    };
  }, []);

  return (
    <>
      <div className="hidden border-b border-cream-400 bg-ink-900 text-white md:block">
        <div className="container-app grid min-h-[46px] grid-cols-[minmax(130px,0.45fr)_minmax(0,2.4fr)_minmax(160px,0.45fr)] items-center gap-2 text-[10px] uppercase text-white/70">
          <div className="flex items-center gap-3 tracking-[0.2em]">
            <span className="text-white/38">Próximo evento</span>
            <span className="h-px w-8 bg-white/24" />
          </div>

          <Link
            to={principalEventHref}
            className="group relative mx-auto flex h-[20px] w-full overflow-hidden text-center text-[12px] tracking-[0.22em] text-white transition-colors hover:text-white/82"
            aria-label={`Ver evento ${nextEvent?.title ?? 'Estrategia Fiscal'}`}
          >
            <span className="nav-event-marquee flex min-w-max items-center font-bold">
              <span className="pr-8">{nextEvent?.title ?? 'Estrategia Fiscal'}</span>
              <span className="pr-8" aria-hidden="true">
                {nextEvent?.title ?? 'Estrategia Fiscal'}
              </span>
              <span className="pr-8" aria-hidden="true">
                {nextEvent?.title ?? 'Estrategia Fiscal'}
              </span>
              <span className="pr-8" aria-hidden="true">
                {nextEvent?.title ?? 'Estrategia Fiscal'}
              </span>
            </span>
          </Link>

          <div className="flex justify-end gap-3 whitespace-nowrap tracking-[0.18em]">
            <span>{nextEventDate}</span>
            <span className="text-white/30">·</span>
            <span>{nextEventLocation}</span>
          </div>
        </div>
      </div>

      <nav className="bg-cream-200 border-b border-cream-400 sticky top-0 z-40">
        <div
          className={`container-app flex items-center justify-between transition-all duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
            compact ? 'h-[48px]' : 'h-[64px] lg:h-[72px]'
          }`}
        >
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex-shrink-0"
          >
            <img
              src={logoDD}
              alt="Diego Díaz"
              className={`object-contain transition-all duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                compact ? 'h-8' : 'h-10 lg:h-12'
              }`}
            />
          </Link>

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

          <div className="flex items-center gap-4">
            <Link
              to={academyHref}
              className="hidden min-h-[44px] items-center border border-ink-900 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-white lg:inline-flex"
            >
              {academyLabel}
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
            <Link
              to={academyHref}
              className="mt-4 flex min-h-[44px] items-center justify-center border border-ink-900 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-white"
              onClick={closeMobileMenu}
            >
              {academyLabel}
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

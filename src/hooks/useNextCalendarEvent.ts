import { useEffect, useMemo, useState } from 'react';
import { useEvents } from '@hooks/useEvents';
import { useNowTick } from '@hooks/useNowTick';
import {
  FALLBACK_CALENDAR_EVENTS,
  getNextUpcomingCalendarEvent,
  loadStoredCalendarEvents,
  mergeCalendarEventSources,
  type CalendarEventSummary,
} from '@utils/eventCalendar';

/**
 * Devuelve el próximo evento upcoming combinando (1) los eventos de la API,
 * (2) los eventos capturados desde admin en localStorage y (3) el calendario
 * fallback. Comparte la misma lógica que Home y Navbar para que todas las
 * secciones muestren el mismo "próximo evento" real, y se recompute al pasar
 * la fecha del evento vigente.
 */
export function useNextCalendarEvent(): CalendarEventSummary {
  const { data: eventsData } = useEvents({ limit: 100, status: 'upcoming' });
  const [storedEvents, setStoredEvents] = useState<CalendarEventSummary[]>(
    loadStoredCalendarEvents,
  );
  const nowTick = useNowTick(30_000);

  useEffect(() => {
    const refresh = () => setStoredEvents(loadStoredCalendarEvents());
    window.addEventListener('storage', refresh);
    window.addEventListener('dd-events-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('dd-events-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return useMemo(() => {
    const candidates = mergeCalendarEventSources(
      FALLBACK_CALENDAR_EVENTS,
      (eventsData?.data as CalendarEventSummary[] | undefined) ?? [],
      storedEvents,
    );
    return (
      getNextUpcomingCalendarEvent(candidates, nowTick) ??
      FALLBACK_CALENDAR_EVENTS[0]
    );
  }, [eventsData?.data, storedEvents, nowTick]);
}

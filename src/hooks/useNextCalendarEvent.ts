import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvents } from '@hooks/useEvents';
import { useNowTick } from '@hooks/useNowTick';
import {
  FALLBACK_CALENDAR_EVENTS,
  getNextUpcomingCalendarEvent,
  isUpcomingCalendarEvent,
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
  const { data: eventsData } = useEvents({ limit: 200, status: 'all' });
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

/**
 * Próxima edición de una serie de eventos (Holding, Prospección…) con la misma
 * mezcla de fuentes de arriba. Si la URL trae ?evento=<slug> y esa edición
 * sigue vigente, se usa esa; si no, la próxima por fecha. Sin ediciones
 * próximas devuelve undefined (la landing decide qué mostrar).
 */
export function useEventEdition(
  matches: (event: CalendarEventSummary) => boolean,
): CalendarEventSummary | undefined {
  const { data: eventsData } = useEvents({ limit: 200, status: 'all' });
  const [storedEvents, setStoredEvents] = useState<CalendarEventSummary[]>(
    loadStoredCalendarEvents,
  );
  const [searchParams] = useSearchParams();
  const requestedSlug = searchParams.get('evento');
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
    const series = mergeCalendarEventSources(
      FALLBACK_CALENDAR_EVENTS,
      (eventsData?.data as CalendarEventSummary[] | undefined) ?? [],
      storedEvents,
    ).filter(matches);
    const requested = requestedSlug
      ? series.find((event) => event.slug === requestedSlug && isUpcomingCalendarEvent(event, nowTick))
      : undefined;
    return requested ?? getNextUpcomingCalendarEvent(series, nowTick);
    // `matches` es estable (función de módulo) en los llamadores.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventsData?.data, storedEvents, requestedSlug, nowTick]);
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as eventsApi from '@api/events.api';
import Spinner from '@atoms/Spinner';
import Button from '@atoms/Button';
import { formatDate, formatCurrency } from '@utils/formatters';
import type { Event as SiteEvent } from '@t/index';

const EVENT_STORAGE_KEY = 'dd-admin-events';
const ENABLE_EVENT_API_SYNC = import.meta.env.VITE_EVENTS_API_SYNC !== "false";

const loadStoredEvent = (slug?: string): SiteEvent | null => {
  if (!slug || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
    const events = raw ? (JSON.parse(raw) as SiteEvent[]) : [];
    return events.find((event) => event.slug === slug) ?? null;
  } catch {
    return null;
  }
};

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [localEvent, setLocalEvent] = useState<SiteEvent | null>(() => loadStoredEvent(slug));
  const { data: apiEvent, isLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsApi.getEventBySlug(slug!),
    enabled: ENABLE_EVENT_API_SYNC && Boolean(slug),
  });
  const event = localEvent ?? apiEvent;

  useEffect(() => {
    const refreshEvent = () => setLocalEvent(loadStoredEvent(slug));
    refreshEvent();
    window.addEventListener('storage', refreshEvent);
    window.addEventListener('dd-events-updated', refreshEvent);
    window.addEventListener('focus', refreshEvent);
    return () => {
      window.removeEventListener('storage', refreshEvent);
      window.removeEventListener('dd-events-updated', refreshEvent);
      window.removeEventListener('focus', refreshEvent);
    };
  }, [slug]);

  if (isLoading && !event) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!event) return <div className="container-app py-20 text-center text-gray-400">Evento no encontrado.</div>;

  return (
    <div className="container-app py-12 max-w-4xl">
      <h1 className="section-title mb-4">{event.title}</h1>
      <p className="text-brand-400 font-semibold mb-2">{formatDate(event.startDate, 'EEEE dd MMMM yyyy, HH:mm')}</p>
      {event.location && <p className="text-gray-400 mb-6">{event.location}</p>}
      <p className="text-gray-300 leading-relaxed mb-8">{event.description}</p>
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-brand-400">{formatCurrency(event.price)}</span>
        <Button>Registrarme</Button>
      </div>
    </div>
  );
}

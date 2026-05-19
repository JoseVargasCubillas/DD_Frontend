import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as eventsApi from '@api/events.api';
import Spinner from '@atoms/Spinner';
import Button from '@atoms/Button';
import { formatDate, formatCurrency } from '@utils/formatters';

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, isLoading } = useQuery({ queryKey: ['event', slug], queryFn: () => eventsApi.getEventBySlug(slug!) });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
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

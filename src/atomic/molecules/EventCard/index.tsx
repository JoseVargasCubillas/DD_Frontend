import { Link } from 'react-router-dom';
import Badge from '@atoms/Badge';
import Button from '@atoms/Button';
import type { Event } from '@types/index';
import { formatDate, formatCurrency } from '@utils/formatters';

interface EventCardProps { event: Event }

export default function EventCard({ event }: EventCardProps) {
  const modalityLabel = { 'in-person': 'Presencial', 'online': 'En línea', 'hybrid': 'Híbrido' }[event.modality];

  return (
    <div className="card flex flex-col md:flex-row gap-0 overflow-hidden">
      <div className="md:w-48 aspect-video md:aspect-auto overflow-hidden">
        <img src={event.thumbnail || '/placeholder-event.jpg'} alt={event.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex gap-2 flex-wrap">
          <Badge label={modalityLabel} variant="info" />
          <Badge label={event.type} />
        </div>
        <h3 className="font-bold text-lg text-white">{event.title}</h3>
        <p className="text-gray-400 text-sm">{formatDate(event.startDate, 'EEEE dd MMM yyyy')}</p>
        {event.location && <p className="text-gray-500 text-sm">{event.location}</p>}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-brand-400 font-bold text-xl">{formatCurrency(event.price)}</span>
          <Button size="sm" as={Link as any} to={`/eventos/${event.slug}`}>Ver más</Button>
        </div>
      </div>
    </div>
  );
}

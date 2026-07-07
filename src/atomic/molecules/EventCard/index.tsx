import { Link } from 'react-router-dom';
import type { Event } from '@t/index';
import { formatDate } from '@utils/formatters';

interface EventCardProps { event: Event }

export default function EventCard({ event }: EventCardProps) {
  const modalityLabel = {
    'in-person': 'Presencial',
    'online':    'En línea',
    'hybrid':    'Híbrido',
  }[event.modality] ?? event.modality;

  const isPast     = event.startDate && new Date(event.startDate) < new Date();
  const remaining  = event.capacity - (event.registeredCount ?? 0);

  const statusLabel = isPast         ? 'Finalizado'
    : remaining <= 0                 ? 'Agotado'
    : remaining < 20                 ? 'Cupos limitados'
    : 'Disponible';

  const badgeClass = (isPast || remaining <= 0 || remaining < 20)
    ? 'badge-limited' : 'badge-avail';

  return (
    <Link
      to={`/eventos/${event.slug}`}
      className="card-lift group flex flex-col overflow-hidden border border-cream-400 bg-white transition-colors hover:border-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30"
    >
      {/* Imagen */}
      {event.thumbnail && (
        <div className="overflow-hidden h-48">
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-ink-400">
          {event.startDate && <span>{formatDate(event.startDate, 'dd MMM')}</span>}
          {event.location  && <><span>·</span><span>{event.location}</span></>}
          {modalityLabel   && <><span>·</span><span>{modalityLabel}</span></>}
          {event.type      && <><span>·</span><span>{event.type}</span></>}
        </div>

        {/* Título */}
        <h3 className="text-[17px] font-normal text-ink-900 leading-tight">
          {event.title}
        </h3>

        {/* Footer card */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className={badgeClass}>{statusLabel}</span>
          <span className="card-arrow w-8 h-8 border border-ink-900 flex items-center justify-center text-ink-900 text-sm group-hover:bg-ink-900 group-hover:text-white transition-colors">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

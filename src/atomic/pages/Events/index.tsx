import { useQuery } from '@tanstack/react-query';
import EventCard from '@molecules/EventCard';
import Spinner from '@atoms/Spinner';
import * as eventsApi from '@api/events.api';

export default function Events() {
  const { data, isLoading } = useQuery({ queryKey: ['events'], queryFn: () => eventsApi.getEvents() });

  return (
    <div className="container-app py-12">
      <h1 className="section-title mb-8">Próximos eventos</h1>
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col gap-4">
          {data?.data.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ticketsApi from '@api/tickets.api';

export const useTicket = (folio: string | undefined, t: string | undefined) =>
  useQuery({
    queryKey: ['ticket', folio, t],
    queryFn: () => ticketsApi.getTicket(folio as string, t),
    enabled: Boolean(folio),
    retry: false,
  });

export const useCheckInTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.checkInTicket,
    onSuccess: (data) => {
      const eventId = data.ticket?.eventId;
      queryClient.invalidateQueries({ queryKey: eventId ? ['event-attendees', eventId] : ['event-attendees'] });
    },
  });
};

export const useUndoCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.undoCheckIn,
    onSuccess: (ticket) => {
      const eventId = ticket?.eventId;
      queryClient.invalidateQueries({ queryKey: eventId ? ['event-attendees', eventId] : ['event-attendees'] });
    },
  });
};

export const useEventAttendees = (eventId: string | undefined) =>
  useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: () => ticketsApi.getEventAttendees(eventId as string),
    enabled: Boolean(eventId),
    refetchInterval: 15_000,
  });

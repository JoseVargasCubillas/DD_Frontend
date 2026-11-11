import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ticketsApi from '@api/tickets.api';
import type { AddAttendeePayload } from '@t/index';

export const useTicket = (folio: string | undefined, t: string | undefined) =>
  useQuery({
    queryKey: ['ticket', folio, t],
    queryFn: () => ticketsApi.getTicket(folio as string, t),
    enabled: Boolean(folio),
    retry: false,
  });

// Eventos con boletos para el selector del escáner (los contadores se refrescan solos).
export const useCheckInEvents = () =>
  useQuery({
    queryKey: ['checkin-events'],
    queryFn: ticketsApi.getCheckInEvents,
    refetchInterval: 30_000,
  });

export const useCheckInTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketsApi.checkInTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['checkin-events'] });
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

// Altas, bajas y eliminaciones desde la vista de asistentes: todas refrescan la lista.
const useAttendeeMutation = <TArgs, TResult>(fn: (args: TArgs) => Promise<TResult>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-attendees'] });
      queryClient.invalidateQueries({ queryKey: ['checkin-events'] });
    },
  });
};

export const useAddAttendee = (eventId: string | undefined) =>
  useAttendeeMutation((payload: AddAttendeePayload) => ticketsApi.addAttendee(eventId as string, payload));
export const useVoidAttendee = () => useAttendeeMutation(ticketsApi.voidAttendee);
export const useReactivateAttendee = () => useAttendeeMutation(ticketsApi.reactivateAttendee);
export const useDeleteAttendee = () => useAttendeeMutation(ticketsApi.deleteAttendee);

export const useEventAttendees = (eventId: string | undefined) =>
  useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: () => ticketsApi.getEventAttendees(eventId as string),
    enabled: Boolean(eventId),
    refetchInterval: 15_000,
  });

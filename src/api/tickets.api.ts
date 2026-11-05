import { client } from './client';
import type { AdminTicket, ApiResponse, CheckInEventOption, EventAttendees, PublicTicket, TicketCheckInResult } from '@t/index';

export const getTicket = (folio: string, t?: string): Promise<PublicTicket> =>
  client.get<ApiResponse<PublicTicket>>(`/tickets/${encodeURIComponent(folio)}`, { t }).then((r) => r.data);

// eventKey fija el evento que se escanea; el servidor rechaza boletos de otro evento.
export const checkInTicket = (payload: { folio: string; t?: string; eventKey?: string }): Promise<TicketCheckInResult> =>
  client.post<ApiResponse<TicketCheckInResult>>('/tickets/check-in', payload).then((r) => r.data);

export const getCheckInEvents = (): Promise<CheckInEventOption[]> =>
  client.get<ApiResponse<CheckInEventOption[]>>('/tickets/check-in/events').then((r) => r.data);

export const undoCheckIn = (folio: string): Promise<AdminTicket> =>
  client.post<ApiResponse<AdminTicket>>(`/tickets/${encodeURIComponent(folio)}/undo-check-in`).then((r) => r.data);

export const getEventAttendees = (eventId: string): Promise<EventAttendees> =>
  client.get<ApiResponse<EventAttendees>>(`/events/${eventId}/attendees`).then((r) => r.data);

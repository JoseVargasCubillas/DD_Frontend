import { client } from './client';
import type { AdminTicket, ApiResponse, EventAttendees, PublicTicket, TicketCheckInResult } from '@t/index';

export const getTicket = (folio: string, t?: string): Promise<PublicTicket> =>
  client.get<ApiResponse<PublicTicket>>(`/tickets/${encodeURIComponent(folio)}`, { t }).then((r) => r.data);

export const checkInTicket = (payload: { folio: string; t?: string }): Promise<TicketCheckInResult> =>
  client.post<ApiResponse<TicketCheckInResult>>('/tickets/check-in', payload).then((r) => r.data);

export const undoCheckIn = (folio: string): Promise<AdminTicket> =>
  client.post<ApiResponse<AdminTicket>>(`/tickets/${encodeURIComponent(folio)}/undo-check-in`).then((r) => r.data);

export const getEventAttendees = (eventId: string): Promise<EventAttendees> =>
  client.get<ApiResponse<EventAttendees>>(`/events/${eventId}/attendees`).then((r) => r.data);

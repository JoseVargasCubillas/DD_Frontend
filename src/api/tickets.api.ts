import { client } from './client';
import type { AddAttendeePayload, AddAttendeeResult, AdminTicket, ApiResponse, CheckInEventOption, EventAttendees, PublicTicket, TicketCheckInResult } from '@t/index';

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

// Alta manual: boleto con QR (presencial) o acceso al grupo de WhatsApp (online).
export const addAttendee = (eventId: string, payload: AddAttendeePayload): Promise<AddAttendeeResult> =>
  client.post<ApiResponse<AddAttendeeResult>>(`/events/${eventId}/attendees`, payload).then((r) => r.data);

// Baja reversible (anula el boleto o revoca el enlace); no se reemite desde HubSpot.
export const voidAttendee = (folio: string): Promise<AdminTicket> =>
  client.post<ApiResponse<AdminTicket>>(`/tickets/${encodeURIComponent(folio)}/void`).then((r) => r.data);

export const reactivateAttendee = (folio: string): Promise<AdminTicket> =>
  client.post<ApiResponse<AdminTicket>>(`/tickets/${encodeURIComponent(folio)}/reactivate`).then((r) => r.data);

// Eliminar: solo altas manuales.
export const deleteAttendee = (folio: string): Promise<void> =>
  client.delete<ApiResponse<unknown>>(`/tickets/${encodeURIComponent(folio)}`).then(() => undefined);

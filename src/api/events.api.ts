import { client } from './client';
import type { Event, PaginatedResponse, ApiResponse } from '@t/index';
import { resolveEventThumbnail } from '@utils/eventFlyers';
import { applyStartDateOverride } from '@utils/eventCalendar';

// Las imágenes del catálogo se guardan como clave estable; aquí se convierten a URL real
// para que todas las vistas (público y admin) reciban un thumbnail que carga.
// También se aplican correcciones puntuales de horario (ver START_DATE_OVERRIDES).
const normalizeEvent = (event: Event): Event =>
  applyStartDateOverride({
    ...event,
    thumbnail: resolveEventThumbnail(event.thumbnail),
  });

export const getEvents = (params?: Record<string, unknown>): Promise<PaginatedResponse<Event>> =>
  client.get<PaginatedResponse<Event>>('/events', params).then((r) => ({
    ...r,
    data: Array.isArray(r.data) ? r.data.map(normalizeEvent) : r.data,
  }));

export const getEventBySlug = (slug: string): Promise<Event> =>
  client.get<ApiResponse<Event>>(`/events/${slug}`).then((r) => normalizeEvent(r.data));

export const createEvent = (data: Partial<Event>): Promise<Event> =>
  client.post<ApiResponse<Event>>('/events', data).then((r) => normalizeEvent(r.data));

export const updateEvent = (id: string, data: Partial<Event>): Promise<Event> =>
  client.put<ApiResponse<Event>>(`/events/${id}`, data).then((r) => normalizeEvent(r.data));

export const deleteEvent = (id: string): Promise<void> =>
  client.delete<ApiResponse<{ id: string }>>(`/events/${id}`).then(() => undefined);

export const uploadEventImage = (
  file: File,
): Promise<{ url: string; filename: string; size: number; mimeType: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  return client
    .post<ApiResponse<{ url: string; filename: string; size: number; mimeType: string }>>(
      '/uploads/events',
      formData,
    )
    .then((r) => r.data);
};

export const registerToEvent = (id: string): Promise<Event> =>
  client.post<ApiResponse<Event>>(`/events/${id}/register`).then((r) => r.data);

export const assignUsersToEvent = (id: string, userIds: string[]): Promise<Event> =>
  client.post<ApiResponse<Event>>(`/events/${id}/assign`, { userIds }).then((r) => r.data);

export const deregisterUsersFromEvent = (id: string, userIds: string[]): Promise<Event> =>
  client.post<ApiResponse<Event>>(`/events/${id}/deregister`, { userIds }).then((r) => r.data);

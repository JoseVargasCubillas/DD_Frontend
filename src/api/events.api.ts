import { client } from './client';
import type { Event, PaginatedResponse, ApiResponse } from '@types/index';

export const getEvents = (params?: Record<string, unknown>): Promise<PaginatedResponse<Event>> =>
  client.get<PaginatedResponse<Event>>('/events', params);

export const getEventBySlug = (slug: string): Promise<Event> =>
  client.get<ApiResponse<Event>>(`/events/${slug}`).then((r) => r.data);

export const createEvent = (data: Partial<Event>): Promise<Event> =>
  client.post<ApiResponse<Event>>('/events', data).then((r) => r.data);

export const updateEvent = (id: string, data: Partial<Event>): Promise<Event> =>
  client.put<ApiResponse<Event>>(`/events/${id}`, data).then((r) => r.data);

export const registerToEvent = (id: string): Promise<Event> =>
  client.post<ApiResponse<Event>>(`/events/${id}/register`).then((r) => r.data);

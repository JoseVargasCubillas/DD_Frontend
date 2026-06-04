import { useQuery } from '@tanstack/react-query';
import * as eventsApi from '@api/events.api';

export interface UseEventParams {
  page?: number;
  limit?: number;
  status?: string;
  [key: string]: unknown;
}

export const useEvents = (params?: UseEventParams) =>
  useQuery({
    queryKey: ['events', params],
    queryFn: () => eventsApi.getEvents(params),
  });

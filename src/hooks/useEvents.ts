import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as eventsApi from "@api/events.api";
import type { Event } from "@t/index";

const EVENTS_API_SYNC_ENABLED =
  import.meta.env.VITE_EVENTS_API_SYNC !== "false";

export interface UseEventParams {
  page?: number;
  limit?: number;
  status?: string;
  enabled?: boolean;
  [key: string]: unknown;
}

export const useEvents = (params?: UseEventParams) => {
  const { enabled = true, ...queryParams } = params ?? {};

  return useQuery({
    queryKey: ["events", queryParams],
    queryFn: () => eventsApi.getEvents(queryParams),
    enabled: EVENTS_API_SYNC_ENABLED && enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Event>) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      eventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useAssignUsersToEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, userIds }: { eventId: string; userIds: string[] }) =>
      eventsApi.assignUsersToEvent(eventId, userIds),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      vars.userIds.forEach((id) => queryClient.invalidateQueries({ queryKey: ["user", id] }));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Contactos registrados al evento");
    },
    onError: (e: Error) => toast.error(e.message || "No se pudo registrar al evento"),
  });
};

export const useDeregisterUsersFromEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, userIds }: { eventId: string; userIds: string[] }) =>
      eventsApi.deregisterUsersFromEvent(eventId, userIds),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      vars.userIds.forEach((id) => queryClient.invalidateQueries({ queryKey: ["user", id] }));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Contactos dados de baja del evento");
    },
    onError: (e: Error) => toast.error(e.message || "No se pudo dar de baja del evento"),
  });
};

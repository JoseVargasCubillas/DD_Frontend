import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as integrationsApi from '@api/integrations.api';

export const useIntegrationsStatus = () =>
  useQuery({
    queryKey: ['integrations-status'],
    queryFn: integrationsApi.getIntegrationsStatus,
    refetchInterval: 30_000,
    retry: false,
  });

export const useSyncEventCatalog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integrationsApi.syncEventCatalog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['integrations-status'] }),
  });
};

export const useSyncHubspot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integrationsApi.syncHubspotNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations-status'] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees'] });
    },
  });
};

import { useQuery } from '@tanstack/react-query';
import { listLeads, type Lead } from '@api/leads.api';

export const useLeads = (source?: string) =>
  useQuery<Lead[]>({
    queryKey: ['leads', source ?? 'all'],
    queryFn: () => listLeads(source),
    staleTime: 60_000,
  });

import { useQuery } from '@tanstack/react-query';
import { getWaClickStats, listWaClicks } from '@api/analytics.api';

export const useWaClickStats = () =>
  useQuery({
    queryKey: ['analytics', 'wa-click', 'stats'],
    queryFn: getWaClickStats,
    staleTime: 60_000,
  });

export const useWaClicks = (source?: string) =>
  useQuery({
    queryKey: ['analytics', 'wa-click', 'list', source ?? 'all'],
    queryFn: () => listWaClicks(source),
    staleTime: 60_000,
  });

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteLeads, listLeads, type Lead } from '@api/leads.api';

export const useLeads = (source?: string) =>
  useQuery<Lead[]>({
    queryKey: ['leads', source ?? 'all'],
    queryFn: () => listLeads(source),
    staleTime: 60_000,
  });

export const useDeleteLeads = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLeads,
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ['leads'] });
      qc.invalidateQueries({ queryKey: ['email-segments'] });
      if (result.missing.length > 0) {
        toast.error(`${result.deleted} leads eliminados, ${result.missing.length} no se encontraron`);
      } else {
        toast.success(`${result.deleted} leads eliminados`);
      }
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudieron eliminar los leads'),
  });
};

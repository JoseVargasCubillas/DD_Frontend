import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as tagsApi from '@api/tags.api';

export const useTags = () =>
  useQuery({ queryKey: ['tags'], queryFn: tagsApi.listTags });

export const useCreateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tagsApi.createTag,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tags'] }); toast.success('Etiqueta creada'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo crear'),
  });
};

export const useUpdateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Parameters<typeof tagsApi.updateTag>[1]> }) =>
      tagsApi.updateTag(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tags'] }); toast.success('Etiqueta actualizada'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar'),
  });
};

export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tagsApi.deleteTag,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tags'] });
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Etiqueta eliminada');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo eliminar'),
  });
};

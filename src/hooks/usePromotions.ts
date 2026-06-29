import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '@api/promotions.api';

export const usePromotions = () =>
  useQuery({ queryKey: ['promotions'], queryFn: api.listPromotions });

export const useCreatePromotion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createPromotion,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotions'] }); toast.success('Promoción creada'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdatePromotion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updatePromotion>[1] }) => api.updatePromotion(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotions'] }); toast.success('Promoción actualizada'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeletePromotion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deletePromotion,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotions'] }); toast.success('Promoción eliminada'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

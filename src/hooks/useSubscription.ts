import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as subsApi from '@api/subscriptions.api';
import { useAuthStore } from '@store/authStore';

export const useSubscription = () => {
  const qc = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: subsApi.getActiveSubscription,
    enabled: isAuthenticated,
  });

  const cancelMutation = useMutation({
    mutationFn: subsApi.cancelSubscription,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subscription'] }); toast.success('Suscripción cancelada'); },
    onError: () => toast.error('Error al cancelar'),
  });

  return { subscription, isLoading, cancel: cancelMutation.mutate };
};

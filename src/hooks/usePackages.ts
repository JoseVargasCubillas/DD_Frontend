import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '@api/packages.api';

export const usePackages = () =>
  useQuery({
    queryKey: ['packages'],
    queryFn: api.listPackages,
    staleTime: 30 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

export const usePackage = (id: string | undefined) =>
  useQuery({
    queryKey: ['package', id],
    queryFn: () => api.getPackage(id!),
    enabled: !!id,
  });

export const useCreatePackage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createPackage,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['packages'] }); toast.success('Paquete creado'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdatePackage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updatePackage>[1] }) => api.updatePackage(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['packages'] }); toast.success('Paquete actualizado'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeletePackage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deletePackage,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['packages'] }); toast.success('Paquete eliminado'); },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useAssignPackage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      packageId,
      durationDays,
    }: {
      userId: string;
      packageId: string;
      durationDays?: number | null;
    }) =>
      api.assignPackageToUser(userId, packageId, {
        durationDays: durationDays ?? null,
        source: 'manual_admin',
        recordAsOrder: true,
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['user', vars.userId] });
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['profile'] });
      qc.invalidateQueries({ queryKey: ['subscription'] });
      qc.invalidateQueries({ queryKey: ['subscriptions', 'admin', 'all'] });
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['orders', 'admin', 'all'] });
      toast.success('Suscripción asignada');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

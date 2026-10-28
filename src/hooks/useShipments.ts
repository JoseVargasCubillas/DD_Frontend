import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '@api/shipments.api';

const invalidateShipments = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ['shipments'] });
  qc.invalidateQueries({ queryKey: ['shipment-advisors'] });
};

export const useShipments = (params: { status?: string; source?: string; search?: string; page?: number }) =>
  useQuery({ queryKey: ['shipments', params], queryFn: () => api.listShipments(params), placeholderData: (prev) => prev });

export const useShipmentQuotes = (id: string, enabled: boolean) =>
  useQuery({ queryKey: ['shipment-quotes', id], queryFn: () => api.getShipmentQuotes(id), enabled, staleTime: 60_000, retry: false });

export const useEditShipment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: api.ShipmentDraft }) => api.editShipment(id, draft),
    onSuccess: () => { invalidateShipments(qc); toast.success('Envío actualizado'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar'),
  });
};

export const useApproveShipment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, choice }: { id: string; choice?: { carrier: string; service: string } }) =>
      api.approveShipment(id, choice),
    onSuccess: () => { invalidateShipments(qc); toast.success('Guía generada'); },
    onError: (e: Error) => { invalidateShipments(qc); toast.error(e.message || 'No se pudo generar la guía'); },
  });
};

export const useRejectShipment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => api.rejectShipment(id, reason),
    onSuccess: () => { invalidateShipments(qc); toast.success('Envío rechazado; se avisó al asesor'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo rechazar'),
  });
};

export const useRefreshTracking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.refreshShipmentTracking(id),
    onSuccess: () => { invalidateShipments(qc); toast.success('Rastreo actualizado'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar el rastreo'),
  });
};

export const useRefreshAllTracking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.refreshAllTracking,
    onSuccess: (r) => { invalidateShipments(qc); toast.success(`Rastreo consultado en ${r.checked} guía(s)`); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar el rastreo'),
  });
};

export const useAdvisors = () =>
  useQuery({ queryKey: ['shipment-advisors'], queryFn: api.listAdvisors });

export const useCreateAdvisor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createAdvisor,
    onSuccess: () => { invalidateShipments(qc); toast.success('Asesor creado'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo crear'),
  });
};

export const useUpdateAdvisor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updateAdvisor>[1] }) => api.updateAdvisor(id, data),
    onSuccess: () => { invalidateShipments(qc); toast.success('Asesor actualizado'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar'),
  });
};

export const useRotateAdvisorToken = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.rotateAdvisorToken,
    onSuccess: () => { invalidateShipments(qc); toast.success('Link nuevo generado; el anterior ya no funciona'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo regenerar'),
  });
};

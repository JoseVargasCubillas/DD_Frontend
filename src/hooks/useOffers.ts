import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as api from '@api/offers.api';

export const useOffers = () =>
  useQuery({ queryKey: ['offers'], queryFn: api.listOffers });

export const useCreateOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Oferta creada');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo crear la oferta'),
  });
};

export const useUpdateOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: api.OfferInput }) => api.updateOffer(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Oferta actualizada');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar la oferta'),
  });
};

export const useDeleteOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteOffer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['offers'] });
      toast.success('Oferta archivada');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo archivar la oferta'),
  });
};

export const useAssignOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, userIds }: { offerId: string; userIds: string[] }) => api.assignOffer(offerId, userIds),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['offers'] });
      vars.userIds.forEach((id) => qc.invalidateQueries({ queryKey: ['user', id] }));
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Oferta asignada');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo asignar la oferta'),
  });
};

export const useRevokeOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, userId }: { offerId: string; userId: string }) => api.revokeOffer(offerId, userId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['offers'] });
      qc.invalidateQueries({ queryKey: ['user', vars.userId] });
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Oferta removida');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo remover la oferta'),
  });
};

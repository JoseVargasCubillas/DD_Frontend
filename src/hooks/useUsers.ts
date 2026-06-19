import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as usersApi from '@api/users.api';

export const useUsers = (params?: { page?: number; limit?: number; search?: string; tagId?: string; role?: string }) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.listUsers(params),
  });

export const useUser = (id: string | undefined) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUser(id!),
    enabled: !!id,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof usersApi.updateUser>[1] }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['user', vars.id] });
      toast.success('Contacto actualizado');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar'),
  });
};

export const useToggleUserActive = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.toggleUserActive,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast.success('Estado actualizado'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar'),
  });
};

export const useAdminCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.adminCreateUser,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      const pwd = data.tempPassword;
      toast.success(pwd ? `Cuenta creada. Clave temporal: ${pwd}` : 'Cuenta creada y enviada por correo', {
        duration: pwd ? 12000 : 4000,
      });
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo crear la cuenta'),
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); toast.success('Perfil actualizado'); },
    onError: (e: Error) => toast.error(e.message || 'No se pudo guardar'),
  });
};

export const useAssignTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, tagId }: { userId: string; tagId: string }) =>
      usersApi.assignTag(userId, tagId),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['user', vars.userId] });
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Etiqueta asignada');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo asignar'),
  });
};

export const useRemoveTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, tagId }: { userId: string; tagId: string }) =>
      usersApi.removeTag(userId, tagId),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['user', vars.userId] });
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Etiqueta removida');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo remover'),
  });
};

export const useUpdateNotes = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, notes }: { userId: string; notes: string }) =>
      usersApi.updateNotes(userId, notes),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['user', vars.userId] });
      toast.success('Notas guardadas');
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo guardar'),
  });
};

export const useSendPassword = () => {
  return useMutation({
    mutationFn: usersApi.sendPasswordReset,
    onSuccess: (data) => {
      const pwd = data.tempPassword;
      toast.success(pwd ? `Nueva contraseña: ${pwd}` : 'Contraseña enviada por correo', {
        duration: pwd ? 12000 : 4000,
      });
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo enviar'),
  });
};

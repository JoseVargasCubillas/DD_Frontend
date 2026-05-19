import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import * as authApi from '@api/auth.api';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => { setAuth(data); toast.success(`Bienvenido, ${data.user.name}`); },
    onError: () => toast.error('Credenciales incorrectas'),
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => { setAuth(data); toast.success('Cuenta creada exitosamente'); },
    onError: () => toast.error('Error al crear la cuenta'),
  });

  const logout = () => { storeLogout(); toast.success('Sesión cerrada'); };

  return { user, isAuthenticated, login: loginMutation.mutate, register: registerMutation.mutate, logout, isLoading: loginMutation.isPending || registerMutation.isPending };
};

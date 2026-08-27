import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import * as authApi from '@api/auth.api';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    retry: 0,
    onSuccess: (data) => {
      setAuth(data);
      toast.success(`Bienvenido, ${data.user.name}`);
      navigate(data.user.role === 'admin' ? '/admin' : '/mi-cuenta');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Credenciales incorrectas';
      toast.error(message || 'Credenciales incorrectas');
    },
  });

  const login = (credentials: LoginCredentials) => {
    if (loginMutation.isPending) return;
    loginMutation.mutate(credentials);
  };

  const logout = () => { storeLogout(); toast.success('Sesión cerrada'); navigate('/'); };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: loginMutation.isPending,
  };
};

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import * as authApi from '@api/auth.api';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      toast.success(`Bienvenido, ${data.user.name}`);
      navigate(data.user.role === 'admin' ? '/admin' : '/mi-cuenta');
    },
    onError: () => toast.error('Credenciales incorrectas'),
  });

  const logout = () => { storeLogout(); toast.success('Sesión cerrada'); navigate('/'); };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
  };
};


import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    retry: 0,
    onSuccess: (data) => {
      setAuth(data);
      toast.success(`Bienvenido, ${data.user.name}`);
      // Si el admin recien creo la cuenta o hizo reset, forzamos cambio de
      // contrasena antes de dejar navegar al panel/cliente.
      if ((data.user as any)?.mustChangePassword) {
        navigate('/mi-cuenta/cambiar-contrasena?forzado=1');
        return;
      }
      // Si venimos de un flujo interrumpido (ej. "inicia sesion para
      // continuar tu compra" en el checkout de libros), regresa ahi en vez
      // del destino generico por rol — solo se acepta una ruta relativa
      // propia, nunca una URL externa.
      const redirect = searchParams.get('redirect');
      const isSafeRedirect = Boolean(redirect) && redirect!.startsWith('/') && !redirect!.startsWith('//');
      navigate(isSafeRedirect ? redirect! : data.user.role === 'admin' ? '/admin' : '/mi-cuenta');
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

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    retry: 0,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    retry: 0,
  });

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading: loginMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetPasswordLoading: resetPasswordMutation.isPending,
  };
};

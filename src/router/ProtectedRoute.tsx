import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

interface Props { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) return <>{children}</>;

  // Sin esto, el login siempre mandaba a /mi-cuenta o /admin sin importar de
  // donde venia el usuario — p.ej. el checkout de un libro se perdia por
  // completo despues de iniciar sesion. useAuth.ts lee este mismo parametro.
  const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
  return <Navigate to={`/iniciar-sesion?redirect=${redirect}`} replace />;
}

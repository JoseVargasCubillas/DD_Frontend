import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

interface Props { children: React.ReactNode }

const FORCED_CHANGE_PATH = '/mi-cuenta/cambiar-contrasena';

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated) {
    // Sin esto, el login siempre mandaba a /mi-cuenta o /admin sin importar de
    // donde venia el usuario — p.ej. el checkout de un libro se perdia por
    // completo despues de iniciar sesion. useAuth.ts lee este mismo parametro.
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/iniciar-sesion?redirect=${redirect}`} replace />;
  }

  // El usuario recien creado / con reset admin debe cambiar la contrasena
  // antes de poder navegar. Lo dejamos entrar solo a la pantalla de cambio.
  if (user?.mustChangePassword && location.pathname !== FORCED_CHANGE_PATH) {
    return <Navigate to={`${FORCED_CHANGE_PATH}?forzado=1`} replace />;
  }

  return <>{children}</>;
}

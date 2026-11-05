import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

interface Props { children: React.ReactNode }

// Pantallas de entrada a eventos (check-in): admin y personal (staff).
export default function StaffRoute({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/iniciar-sesion?redirect=${redirect}`} replace />;
  }
  if (user.role !== 'admin' && user.role !== 'staff') return <Navigate to="/" replace />;
  if (user.mustChangePassword) return <Navigate to="/mi-cuenta/cambiar-contrasena?forzado=1" replace />;
  return <>{children}</>;
}

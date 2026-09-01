import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

interface Props { children: React.ReactNode }

export default function AdminRoute({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/iniciar-sesion?redirect=${redirect}`} replace />;
  }
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

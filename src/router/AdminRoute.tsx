import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

interface Props { children: React.ReactNode }

export default function AdminRoute({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/iniciar-sesion" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

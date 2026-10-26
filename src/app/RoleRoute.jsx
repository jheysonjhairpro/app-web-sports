import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

// Deja pasar solo a los roles indicados; el resto vuelve al inicio.
export default function RoleRoute({ roles, children }) {
  const { rol } = useAuth();
  if (!roles.includes(rol)) return <Navigate to="/" replace />;
  return children;
}

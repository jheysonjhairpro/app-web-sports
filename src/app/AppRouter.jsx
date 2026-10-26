import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import MainLayout from '@/shared/components/MainLayout';
import { useAuth } from '@/features/auth/AuthContext';
import LoginPage from '@/features/auth/LoginPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import UsuariosPage from '@/features/usuarios/UsuariosPage';
import ComplejosPage from '@/features/complejos/ComplejosPage';

// Pantalla de inicio según el rol.
function Home() {
  const { isSuper } = useAuth();
  return <Navigate to={isSuper ? '/dashboard' : '/complejos'} replace />;
}

const SUPER = ['super_admin'];

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <RoleRoute roles={SUPER}>
              <DashboardPage />
            </RoleRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RoleRoute roles={SUPER}>
              <UsuariosPage />
            </RoleRoute>
          }
        />
        <Route path="/complejos" element={<ComplejosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

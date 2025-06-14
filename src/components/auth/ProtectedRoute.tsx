import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { AccessControl } from './AccessControl';

interface ProtectedRouteProps {
  isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAdmin = false }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Verificação de admin (mantém a lógica existente)
  if (isAdmin) {
    const isOwner = user.email === 'admin@piercerhub.com';
    if (!isOwner) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  // Para rotas normais, verificar assinatura
  return (
    <AccessControl>
      <Outlet />
    </AccessControl>
  );
};

export default ProtectedRoute;


import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mostrar um indicador de carregamento enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Redirecionar para página de login se não estiver autenticado
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Verificação adicional para rotas de administração
  if (isAdmin) {
    // Na implementação real, você verificaria o papel do usuário no banco de dados
    // Para este exemplo, apenas verificamos se o email do usuário é de administrador
    const isAdminUser = user.email === 'admin@piercerhub.com';
    
    if (!isAdminUser) {
      // Se não for administrador, redireciona para o dashboard comum
      return <Navigate to="/" replace />;
    }
  }

  // Renderizar o componente filho se estiver autenticado (e for admin, se necessário)
  return <Outlet />;
};

export default ProtectedRoute;

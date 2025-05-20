
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute = () => {
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

  // Renderizar o componente filho se estiver autenticado
  return <Outlet />;
};

export default ProtectedRoute;

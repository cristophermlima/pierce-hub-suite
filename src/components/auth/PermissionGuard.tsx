import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTeamContext, TeamPermissions } from '@/hooks/useTeamContext';
import { toast } from 'sonner';

interface PermissionGuardProps {
  permission: keyof TeamPermissions;
  children: React.ReactNode;
  redirectTo?: string;
}

export function PermissionGuard({ permission, children, redirectTo = '/' }: PermissionGuardProps) {
  const { permissions, isOwner, isLoading } = useTeamContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Donos sempre têm acesso
  if (isOwner) {
    return <>{children}</>;
  }

  // Verificar permissão do membro
  if (!permissions[permission]) {
    toast.error('Você não tem permissão para acessar esta página');
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

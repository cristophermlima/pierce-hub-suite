
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { AccessBlocked } from '@/components/AccessBlocked';
import { Loader2 } from 'lucide-react';

interface AccessControlProps {
  children: React.ReactNode;
}

export function AccessControl({ children }: AccessControlProps) {
  const { hasActiveAccess, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasActiveAccess) {
    return <AccessBlocked />;
  }

  return <>{children}</>;
}

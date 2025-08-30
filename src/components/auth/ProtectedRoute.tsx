
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAdmin = false }) => {
  const { user, loading } = useAuth();
  const [hasAdminRole, setHasAdminRole] = useState<boolean | null>(null);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    if (isAdmin && user) {
      setRoleLoading(true);
      // Check if user has admin role using the new role system
      const checkAdminRole = async () => {
        try {
          const { data, error } = await supabase.rpc('has_role', { 
            _user_id: user.id, 
            _role: 'admin' 
          });
          
          if (error) {
            console.error('Error checking admin role:', error);
            setHasAdminRole(false);
          } else {
            setHasAdminRole(data);
          }
        } catch (error) {
          console.error('Error checking admin role:', error);
          setHasAdminRole(false);
        } finally {
          setRoleLoading(false);
        }
      };
      
      checkAdminRole();
    }
  }, [isAdmin, user]);

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

  // Admin role verification using database-based role system
  if (isAdmin) {
    if (roleLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
    if (!hasAdminRole) {
      return <Navigate to="/" replace />;
    }
  }

  // Durante a fase de testes, sempre permitir acesso sem verificação de assinatura
  return <Outlet />;
};

export default ProtectedRoute;

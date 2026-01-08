import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface TeamPermissions {
  pos: boolean;
  clients: boolean;
  inventory: boolean;
  reports: boolean;
  settings: boolean;
  appointments: boolean;
}

export interface TeamContext {
  isTeamMember: boolean;
  isOwner: boolean;
  ownerUserId: string | null;
  permissions: TeamPermissions;
  memberName: string | null;
  isLoading: boolean;
}

const DEFAULT_OWNER_PERMISSIONS: TeamPermissions = {
  pos: true,
  clients: true,
  inventory: true,
  reports: true,
  settings: true,
  appointments: true,
};

export function useTeamContext(): TeamContext {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['team-context', user?.id],
    queryFn: async (): Promise<{
      isTeamMember: boolean;
      ownerUserId: string | null;
      permissions: TeamPermissions;
      memberName: string | null;
    }> => {
      if (!user?.id) {
        return {
          isTeamMember: false,
          ownerUserId: null,
          permissions: DEFAULT_OWNER_PERMISSIONS,
          memberName: null,
        };
      }

      // Verificar se o usuário é um membro de equipe
      const { data: teamMember, error } = await supabase
        .from('team_members')
        .select('owner_user_id, permissions, name, is_active')
        .eq('member_user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching team context:', error);
        return {
          isTeamMember: false,
          ownerUserId: null,
          permissions: DEFAULT_OWNER_PERMISSIONS,
          memberName: null,
        };
      }

      if (teamMember) {
        // Usuário é um membro de equipe
        return {
          isTeamMember: true,
          ownerUserId: teamMember.owner_user_id,
          permissions: (teamMember.permissions as unknown as TeamPermissions) || DEFAULT_OWNER_PERMISSIONS,
          memberName: teamMember.name,
        };
      }

      // Usuário é um dono (não é membro de nenhuma equipe)
      return {
        isTeamMember: false,
        ownerUserId: user.id,
        permissions: DEFAULT_OWNER_PERMISSIONS,
        memberName: null,
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    isTeamMember: data?.isTeamMember ?? false,
    isOwner: !data?.isTeamMember,
    ownerUserId: data?.ownerUserId ?? user?.id ?? null,
    permissions: data?.permissions ?? DEFAULT_OWNER_PERMISSIONS,
    memberName: data?.memberName ?? null,
    isLoading,
  };
}

export function hasPermission(permissions: TeamPermissions, permission: keyof TeamPermissions): boolean {
  return permissions[permission] === true;
}

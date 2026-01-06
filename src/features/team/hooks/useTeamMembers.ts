import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export interface TeamPermissions {
  pos: boolean;
  clients: boolean;
  inventory: boolean;
  reports: boolean;
  settings: boolean;
  appointments: boolean;
}

export interface TeamMember {
  id: string;
  owner_user_id: string;
  member_user_id: string;
  name: string;
  email: string;
  role: string;
  permissions: TeamPermissions;
  is_active: boolean;
  created_at: string;
}

export interface TeamMemberInput {
  name: string;
  email: string;
  role: string;
  permissions: TeamPermissions;
}

const DEFAULT_PERMISSIONS: TeamPermissions = {
  pos: true,
  clients: true,
  inventory: false,
  reports: false,
  settings: false,
  appointments: true,
};

export function useTeamMembers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ['team-members', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(row => ({
        ...row,
        is_active: row.is_active ?? true,
        created_at: row.created_at ?? new Date().toISOString(),
        permissions: (row.permissions as unknown as TeamPermissions) || DEFAULT_PERMISSIONS,
      })) as TeamMember[];
    },
    enabled: !!user?.id,
  });

  // Fetch business name for invite email
  const getBusinessName = async (): Promise<string> => {
    try {
      const { data } = await supabase
        .from('business_settings')
        .select('business_name')
        .eq('user_id', user?.id)
        .maybeSingle();
      return data?.business_name || 'PiercerHub';
    } catch {
      return 'PiercerHub';
    }
  };

  const addMember = useMutation({
    mutationFn: async (input: TeamMemberInput) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Check if member already exists
      const { data: existing } = await supabase
        .from('team_members')
        .select('id')
        .eq('owner_user_id', user.id)
        .eq('email', input.email)
        .maybeSingle();

      if (existing) {
        throw new Error('Este email já está cadastrado na equipe');
      }

      // Get owner name and business name for the invite email
      const ownerName = user.user_metadata?.first_name || 'Administrador';
      const businessName = await getBusinessName();

      // Call edge function to create user and send invite
      const { data: inviteData, error: inviteError } = await supabase.functions.invoke(
        'send-team-invite',
        {
          body: {
            email: input.email,
            name: input.name,
            role: input.role,
            ownerName,
            businessName,
          },
        }
      );

      if (inviteError) {
        console.error('Invite error:', inviteError);
        throw new Error(inviteError.message || 'Erro ao enviar convite');
      }

      if (inviteData?.error) {
        throw new Error(inviteData.error);
      }

      const memberUserId = inviteData?.userId;
      if (!memberUserId) {
        throw new Error('Falha ao criar usuário');
      }

      // Save team member with real user ID
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          owner_user_id: user.id,
          member_user_id: memberUserId,
          name: input.name,
          email: input.email,
          role: input.role,
          permissions: JSON.parse(JSON.stringify(input.permissions)),
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Membro adicionado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar membro');
    },
  });

  const updateMember = useMutation({
    mutationFn: async ({ id, ...input }: Partial<TeamMemberInput> & { id: string }) => {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (input.name) updateData.name = input.name;
      if (input.email) updateData.email = input.email;
      if (input.role) updateData.role = input.role;
      if (input.permissions) updateData.permissions = input.permissions;

      const { data, error } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Membro atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar membro');
    },
  });

  const removeMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Membro removido com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao remover membro');
    },
  });

  const toggleMemberStatus = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
      toast.success('Status atualizado!');
    },
    onError: () => {
      toast.error('Erro ao atualizar status');
    },
  });

  return {
    teamMembers,
    isLoading,
    addMember,
    updateMember,
    removeMember,
    toggleMemberStatus,
    DEFAULT_PERMISSIONS,
  };
}

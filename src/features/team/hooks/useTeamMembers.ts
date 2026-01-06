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
      
      // Transform data to ensure permissions has correct shape
      return (data || []).map(row => ({
        ...row,
        is_active: row.is_active ?? true,
        created_at: row.created_at ?? new Date().toISOString(),
        permissions: (row.permissions as unknown as TeamPermissions) || DEFAULT_PERMISSIONS,
      })) as TeamMember[];
    },
    enabled: !!user?.id,
  });

  const addMember = useMutation({
    mutationFn: async (input: TeamMemberInput) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // First, check if the email exists in auth.users by looking for existing team member or trying to find user
      // We need to invite the user first - they need to create an account
      // For now, we'll create a placeholder that will be linked when user signs up
      
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

      // Create invitation - member_user_id will be set to a placeholder UUID
      // In a production app, you'd send an invite email and link when they sign up
      const placeholderUserId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          owner_user_id: user.id,
          member_user_id: placeholderUserId,
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


import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
}

export function useProfileSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar perfil do usuário
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar dados do perfil na tabela profiles se existir, senão usar dados do auth
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        first_name: profileData?.first_name || user.user_metadata?.first_name || '',
        last_name: profileData?.last_name || user.user_metadata?.last_name || '',
        phone: profileData?.phone || user.user_metadata?.phone || '',
        role: profileData?.role || 'Piercer'
      };
    },
  });

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Atualizar metadados do usuário
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone
        }
      });

      if (authError) throw authError;

      // Tentar inserir/atualizar na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          role: data.role
        });

      // Se a tabela profiles não existir, não é um erro crítico
      console.log('Profile update:', profileError);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao atualizar perfil:', error);
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
}

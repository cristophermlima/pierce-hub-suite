import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AftercareTemplate, AftercareFormData } from '../types';
import { getEffectiveUserId } from '@/lib/effectiveUser';

export function useAftercareTemplates() {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['aftercare-templates'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('aftercare_templates')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as AftercareTemplate[];
    }
  });

  const createTemplate = useMutation({
    mutationFn: async (templateData: AftercareFormData) => {
      const effectiveUserId = await getEffectiveUserId();

      const { data, error } = await supabase
        .from('aftercare_templates')
        .insert({
          ...templateData,
          user_id: effectiveUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aftercare-templates'] });
      toast.success('Template de cuidados criado com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar template: ${error.message}`);
    }
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AftercareFormData }) => {
      // RLS gerencia acesso - sem filtro de user_id
      const { data: result, error } = await supabase
        .from('aftercare_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aftercare-templates'] });
      toast.success('Template atualizado com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar template: ${error.message}`);
    }
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      // RLS gerencia acesso - sem filtro de user_id
      const { error } = await supabase
        .from('aftercare_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aftercare-templates'] });
      toast.success('Template excluído com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir template: ${error.message}`);
    }
  });

  return {
    templates,
    isLoading,
    createTemplate: createTemplate.mutate,
    updateTemplate: updateTemplate.mutate,
    deleteTemplate: deleteTemplate.mutate,
    isCreating: createTemplate.isPending,
    isUpdating: updateTemplate.isPending,
    isDeleting: deleteTemplate.isPending
  };
}

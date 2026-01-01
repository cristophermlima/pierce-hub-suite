
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BusinessSettings {
  id?: string;
  user_id: string;
  business_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string;
  business_hours: string;
  website: string;
}

export function useBusinessSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar configurações da empresa
  const { data: settings, isLoading } = useQuery({
    queryKey: ['business-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        user_id: user.id,
        business_name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        description: '',
        business_hours: '',
        website: ''
      };
    },
  });

  // Mutation para atualizar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Omit<BusinessSettings, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se já existe registro
      const { data: existing } = await supabase
        .from('business_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        // Update existente
        const { error } = await supabase
          .from('business_settings')
          .update({
            business_name: data.business_name,
            address: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            description: data.description,
            business_hours: data.business_hours,
            website: data.website,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert novo
        const { error } = await supabase
          .from('business_settings')
          .insert({
            user_id: user.id,
            business_name: data.business_name,
            address: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            description: data.description,
            business_hours: data.business_hours,
            website: data.website
          });

        if (error) throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-settings'] });
      toast({
        title: "Configurações salvas",
        description: "Suas configurações da empresa foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao salvar configurações:', error);
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending
  };
}

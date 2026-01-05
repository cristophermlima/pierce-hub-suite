import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';

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
  whatsapp_support: string;
}

const businessSettingsSchema = z.object({
  user_id: z.string().min(1),
  business_name: z.string().trim().min(1, 'Informe o nome do estúdio').max(120),
  address: z.string().trim().max(255).optional().default(''),
  city: z.string().trim().max(120).optional().default(''),
  state: z.string().trim().max(120).optional().default(''),
  zip_code: z.string().trim().max(20).optional().default(''),
  description: z.string().trim().max(1000).optional().default(''),
  business_hours: z.string().trim().max(255).optional().default(''),
  website: z.string().trim().max(255).optional().default(''),
  whatsapp_support: z.string().trim().max(20).optional().default(''),
});

export function useBusinessSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar configurações da empresa
  const {
    data: settings,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['business-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      return (
        data || {
          user_id: user.id,
          business_name: '',
          address: '',
          city: '',
          state: '',
          zip_code: '',
          description: '',
          business_hours: '',
          website: '',
          whatsapp_support: '',
        }
      );
    },
  });

  // Mutation para atualizar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Omit<BusinessSettings, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Validação + normalização
      const parsed = businessSettingsSchema.parse({
        ...data,
        user_id: user.id,
      });

      // Verificar se já existe registro
      const { data: existing, error: existingError } = await supabase
        .from('business_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingError) throw existingError;

      if (existing?.id) {
        const { error } = await supabase
          .from('business_settings')
          .update({
            business_name: parsed.business_name,
            address: parsed.address,
            city: parsed.city,
            state: parsed.state,
            zip_code: parsed.zip_code,
            description: parsed.description,
            business_hours: parsed.business_hours,
            website: parsed.website,
            whatsapp_support: parsed.whatsapp_support,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('business_settings').insert({
          user_id: user.id,
          business_name: parsed.business_name,
          address: parsed.address,
          city: parsed.city,
          state: parsed.state,
          zip_code: parsed.zip_code,
          description: parsed.description,
          business_hours: parsed.business_hours,
          website: parsed.website,
          whatsapp_support: parsed.whatsapp_support,
        });

        if (error) throw error;
      }

      // Buscar registro salvo (evita “sumir” por estado/invalidations)
      const { data: refreshed, error: refreshedError } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (refreshedError || !refreshed) throw refreshedError;
      return refreshed as BusinessSettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['business-settings'], data);
      queryClient.invalidateQueries({ queryKey: ['business-settings'] });
      toast({
        title: 'Configurações salvas',
        description: 'Suas configurações da empresa foram salvas com sucesso.',
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Não foi possível salvar as alterações. Tente novamente.';
      toast({
        title: 'Erro ao salvar configurações',
        description: message,
        variant: 'destructive',
      });
      console.error('Erro ao salvar configurações:', error);
    },
  });

  return {
    settings,
    isLoading,
    error,
    isError,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
  };
}

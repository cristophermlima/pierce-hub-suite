
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface NotificationSettings {
  id?: string;
  user_id: string;
  email_appointments: boolean;
  email_reminders: boolean;
  email_inventory: boolean;
  email_reports: boolean;
  email_marketing: boolean;
  app_appointments: boolean;
  app_cancellations: boolean;
  app_inventory: boolean;
  app_client: boolean;
}

export function useNotificationSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estado local para as configurações
  const [settings, setSettings] = useState<NotificationSettings>({
    user_id: '',
    email_appointments: true,
    email_reminders: true,
    email_inventory: true,
    email_reports: false,
    email_marketing: false,
    app_appointments: true,
    app_cancellations: true,
    app_inventory: true,
    app_client: true,
  });

  // Buscar configurações de notificação
  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || {
        user_id: user.id,
        email_appointments: true,
        email_reminders: true,
        email_inventory: true,
        email_reports: false,
        email_marketing: false,
        app_appointments: true,
        app_cancellations: true,
        app_inventory: true,
        app_client: true,
      };
    },
  });

  // Atualizar estado local quando dados chegarem
  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  // Mutation para atualizar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Omit<NotificationSettings, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...newSettings
        });

      if (error) throw error;
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: "Configurações salvas",
        description: "Suas preferências de notificação foram salvas com sucesso.",
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

  const updateSetting = (key: keyof Omit<NotificationSettings, 'id' | 'user_id'>, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  return {
    settings,
    isLoading,
    updateSetting,
    saveSettings,
    isUpdating: updateSettingsMutation.isPending
  };
}

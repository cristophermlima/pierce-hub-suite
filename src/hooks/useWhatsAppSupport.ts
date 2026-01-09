import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useWhatsAppSupport() {
  const { data: whatsappNumber } = useQuery({
    queryKey: ['whatsapp-support-number'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('business_settings')
        .select('whatsapp_support')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching WhatsApp number:', error);
        return null;
      }

      return data?.whatsapp_support || null;
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });

  return whatsappNumber;
}

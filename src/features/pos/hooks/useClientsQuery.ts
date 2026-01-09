
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface POSClient {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  visits: number;
  birthDate: string | null;
}

export function useClientsQuery() {
  return useQuery({
    queryKey: ['pos-clients'],
    queryFn: async (): Promise<POSClient[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // RLS gerencia acesso - sem filtro de user_id
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone, visits, birth_date')
        .order('name');

      if (error) throw error;

      return data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        visits: client.visits || 0,
        birthDate: client.birth_date
      }));
    },
  });
}

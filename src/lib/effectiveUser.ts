import { supabase } from '@/integrations/supabase/client';

/**
 * Obtém o effective_user_id para o usuário atual.
 * Se o usuário for um membro de equipe, retorna o owner_user_id.
 * Se for um dono, retorna seu próprio ID.
 */
export async function getEffectiveUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase.rpc('get_my_effective_user_id');
  
  if (error) {
    console.error('Error getting effective user id:', error);
    // Fallback para o ID do usuário atual
    return user.id;
  }

  return data || user.id;
}

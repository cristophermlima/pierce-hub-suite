
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_type: 'trial' | 'premium' | 'expired';
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
}

export function useSubscription() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.log('Usuário ainda não tem registro de assinatura, criando acesso de teste...');
        return null;
      }
      
      return data as UserSubscription;
    }
  });

  const hasActiveAccess = () => {
    // Durante a fase de testes, sempre permitir acesso
    return true;
  };

  const getDaysRemaining = () => {
    if (!subscription) return 10; // Valor padrão para novos usuários
    
    const now = new Date();
    let endDate: Date | null = null;
    
    if (subscription.subscription_type === 'trial' && subscription.trial_end_date) {
      endDate = new Date(subscription.trial_end_date);
    } else if (subscription.subscription_type === 'premium' && subscription.subscription_end_date) {
      endDate = new Date(subscription.subscription_end_date);
    }
    
    if (!endDate) return 10;
    
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return {
    subscription,
    isLoading,
    hasActiveAccess: hasActiveAccess(),
    daysRemaining: getDaysRemaining(),
    isTrial: subscription?.subscription_type === 'trial',
    isPremium: subscription?.subscription_type === 'premium',
    isExpired: subscription?.subscription_type === 'expired'
  };
}

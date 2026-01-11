import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserSubscription {
  id: string;
  user_id: string;
  subscription_type: 'trial' | 'active' | 'expired';
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export interface StripeSubscriptionStatus {
  subscribed: boolean;
  status: string;
  trial_active: boolean;
  trial_end?: string;
  subscription_end?: string;
  product_id?: string;
}

export function useSubscription() {
  const queryClient = useQueryClient();

  // Check subscription status from Stripe
  const { data: stripeStatus, isLoading: isCheckingStripe, refetch: refetchStripe } = useQuery({
    queryKey: ["stripe-subscription-status"],
    queryFn: async (): Promise<StripeSubscriptionStatus | null> => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        
        if (error) {
          console.error('Error checking subscription:', error);
          return null;
        }
        
        return data as StripeSubscriptionStatus;
      } catch (err) {
        console.error('Failed to check subscription:', err);
        return null;
      }
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });

  // Local subscription data
  const { data: subscription, isLoading: isLoadingLocal } = useQuery({
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
        console.log('User has no subscription record yet');
        return null;
      }
      
      return data as UserSubscription;
    }
  });

  // Create checkout session
  const createCheckout = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      console.error('Checkout error:', error);
      toast.error('Erro ao iniciar checkout');
    },
  });

  // Open customer portal
  const openCustomerPortal = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      console.error('Portal error:', error);
      toast.error('Erro ao abrir portal de gerenciamento');
    },
  });

  const hasActiveAccess = () => {
    // If Stripe says subscribed (active or trialing), allow access
    if (stripeStatus?.subscribed) return true;
    
    // Fallback to local data during initial load
    if (isCheckingStripe && subscription) {
      return subscription.subscription_type === 'trial' || subscription.subscription_type === 'active';
    }
    
    // During testing phase, always allow access
    return true;
  };

  const getDaysRemaining = () => {
    // Use Stripe data if available
    if (stripeStatus?.trial_end) {
      const now = new Date();
      const endDate = new Date(stripeStatus.trial_end);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    
    if (stripeStatus?.subscription_end) {
      const now = new Date();
      const endDate = new Date(stripeStatus.subscription_end);
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    }
    
    // Fallback to local subscription data
    if (!subscription) return 10;
    
    const now = new Date();
    let endDate: Date | null = null;
    
    if (subscription.subscription_type === 'trial' && subscription.trial_end_date) {
      endDate = new Date(subscription.trial_end_date);
    } else if (subscription.subscription_type === 'active' && subscription.subscription_end_date) {
      endDate = new Date(subscription.subscription_end_date);
    }
    
    if (!endDate) return 10;
    
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  return {
    subscription,
    stripeStatus,
    isLoading: isLoadingLocal || isCheckingStripe,
    hasActiveAccess: hasActiveAccess(),
    daysRemaining: getDaysRemaining(),
    isTrial: stripeStatus?.trial_active ?? subscription?.subscription_type === 'trial',
    isSubscribed: stripeStatus?.subscribed ?? false,
    isExpired: !stripeStatus?.subscribed && stripeStatus?.status === 'canceled',
    createCheckout: createCheckout.mutate,
    isCreatingCheckout: createCheckout.isPending,
    openCustomerPortal: openCustomerPortal.mutate,
    isOpeningPortal: openCustomerPortal.isPending,
    refetchSubscription: () => {
      refetchStripe();
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    },
  };
}

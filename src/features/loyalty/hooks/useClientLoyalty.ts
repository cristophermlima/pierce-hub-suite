import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getEffectiveUserId } from "@/lib/effectiveUser";

export interface ClientLoyalty {
  id: string;
  client_id: string;
  plan_id: string;
  user_id: string;
  points: number;
  total_spent: number;
  rewards_claimed: number;
  last_reward_at: string | null;
  enrolled_at: string;
  created_at: string;
  updated_at: string;
  // Joined data
  client?: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    visits: number;
    birth_date: string | null;
  };
  plan?: {
    id: string;
    name: string;
    conditions: any;
    reward: any;
    active: boolean;
  };
}

export interface LoyaltyRewardHistory {
  id: string;
  client_loyalty_id: string;
  reward_type: string;
  reward_value: number | null;
  description: string | null;
  sale_id: string | null;
  redeemed_at: string;
}

export function useClientLoyalty() {
  const queryClient = useQueryClient();

  // Buscar todos os vínculos cliente-plano
  const { data: clientLoyalties = [], isLoading } = useQuery({
    queryKey: ['client-loyalty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_loyalty')
        .select(`
          *,
          client:clients(id, name, phone, email, visits, birth_date),
          plan:loyalty_plans(id, name, conditions, reward, active)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as ClientLoyalty[];
    }
  });

  // Matricular cliente em um plano
  const enrollMutation = useMutation({
    mutationFn: async ({ clientId, planId }: { clientId: string; planId: string }) => {
      const effectiveUserId = await getEffectiveUserId();
      
      const { data, error } = await supabase
        .from('client_loyalty')
        .insert({
          client_id: clientId,
          plan_id: planId,
          user_id: effectiveUserId,
          points: 0,
          total_spent: 0
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Cliente já está matriculado neste plano');
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-loyalty'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-clients'] });
      toast.success('Cliente matriculado no plano de fidelidade!');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    }
  });

  // Remover cliente de um plano
  const unenrollMutation = useMutation({
    mutationFn: async (clientLoyaltyId: string) => {
      const { error } = await supabase
        .from('client_loyalty')
        .delete()
        .eq('id', clientLoyaltyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-loyalty'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-clients'] });
      toast.success('Cliente removido do plano');
    },
    onError: () => {
      toast.error('Erro ao remover cliente do plano');
    }
  });

  // Adicionar pontos/gastos ao cliente
  const addPointsMutation = useMutation({
    mutationFn: async ({ 
      clientId, 
      points = 0, 
      amountSpent = 0 
    }: { 
      clientId: string; 
      points?: number; 
      amountSpent?: number 
    }) => {
      // Buscar todos os planos ativos do cliente
      const { data: enrollments, error: fetchError } = await supabase
        .from('client_loyalty')
        .select('id, points, total_spent, plan:loyalty_plans(conditions, reward)')
        .eq('client_id', clientId);

      if (fetchError) throw fetchError;
      if (!enrollments?.length) return null;

      // Atualizar cada enrollment
      for (const enrollment of enrollments) {
        const newPoints = (enrollment.points || 0) + points;
        const newTotalSpent = Number(enrollment.total_spent || 0) + amountSpent;

        await supabase
          .from('client_loyalty')
          .update({
            points: newPoints,
            total_spent: newTotalSpent
          })
          .eq('id', enrollment.id);
      }

      return enrollments;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-loyalty'] });
    }
  });

  // Resgatar recompensa
  const redeemRewardMutation = useMutation({
    mutationFn: async ({ 
      clientLoyaltyId, 
      rewardType, 
      rewardValue, 
      description,
      saleId
    }: { 
      clientLoyaltyId: string; 
      rewardType: string;
      rewardValue?: number;
      description?: string;
      saleId?: string;
    }) => {
      // Registrar no histórico
      const { error: historyError } = await supabase
        .from('loyalty_rewards_history')
        .insert({
          client_loyalty_id: clientLoyaltyId,
          reward_type: rewardType,
          reward_value: rewardValue,
          description: description,
          sale_id: saleId
        });

      if (historyError) throw historyError;

      // Buscar e atualizar contador de recompensas
      {
        const { data: current } = await supabase
          .from('client_loyalty')
          .select('rewards_claimed')
          .eq('id', clientLoyaltyId)
          .single();

        await supabase
          .from('client_loyalty')
          .update({
            rewards_claimed: (current?.rewards_claimed || 0) + 1,
            last_reward_at: new Date().toISOString()
          })
          .eq('id', clientLoyaltyId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-loyalty'] });
      toast.success('Recompensa resgatada!');
    },
    onError: () => {
      toast.error('Erro ao resgatar recompensa');
    }
  });

  // Verificar se cliente está elegível para recompensa
  const checkEligibility = (clientLoyalty: ClientLoyalty): { eligible: boolean; reason?: string; discount?: number } => {
    if (!clientLoyalty.plan?.conditions || !clientLoyalty.plan?.reward) {
      return { eligible: false };
    }

    const conditions = clientLoyalty.plan.conditions;
    const reward = clientLoyalty.plan.reward;

    // Verificar condição por visitas
    if (conditions.type === 'visits' && conditions.min_visits) {
      const clientVisits = clientLoyalty.client?.visits || 0;
      if (clientVisits >= conditions.min_visits) {
        return { 
          eligible: true, 
          reason: `${conditions.min_visits} visitas completadas`,
          discount: reward.discount_percentage
        };
      }
    }

    // Verificar condição por gastos
    if (conditions.type === 'spending' && conditions.min_amount) {
      if (clientLoyalty.total_spent >= conditions.min_amount) {
        return { 
          eligible: true, 
          reason: `R$ ${conditions.min_amount} gastos`,
          discount: reward.discount_percentage
        };
      }
    }

    // Verificar condição por pontos
    if (conditions.type === 'points' && conditions.min_points) {
      if (clientLoyalty.points >= conditions.min_points) {
        return { 
          eligible: true, 
          reason: `${conditions.min_points} pontos acumulados`,
          discount: reward.discount_percentage
        };
      }
    }

    // Verificar aniversário
    if (conditions.type === 'birthday') {
      const birthDate = clientLoyalty.client?.birth_date;
      if (birthDate) {
        const birth = new Date(birthDate);
        const now = new Date();
        if (birth.getMonth() === now.getMonth()) {
          return { 
            eligible: true, 
            reason: 'Aniversariante do mês',
            discount: reward.discount_percentage
          };
        }
      }
    }

    return { eligible: false };
  };

  // Obter melhor desconto disponível para um cliente
  const getBestDiscount = (clientId: string): { discount: number; planName: string; reason: string } | null => {
    const clientEnrollments = clientLoyalties.filter(cl => cl.client_id === clientId);
    
    let bestDiscount: { discount: number; planName: string; reason: string } | null = null;

    for (const enrollment of clientEnrollments) {
      const eligibility = checkEligibility(enrollment);
      if (eligibility.eligible && eligibility.discount) {
        if (!bestDiscount || eligibility.discount > bestDiscount.discount) {
          bestDiscount = {
            discount: eligibility.discount,
            planName: enrollment.plan?.name || '',
            reason: eligibility.reason || ''
          };
        }
      }
    }

    return bestDiscount;
  };

  // Obter vínculos de um cliente específico
  const getClientEnrollments = (clientId: string) => {
    return clientLoyalties.filter(cl => cl.client_id === clientId);
  };

  // Obter clientes de um plano específico
  const getPlanClients = (planId: string) => {
    return clientLoyalties.filter(cl => cl.plan_id === planId);
  };

  return {
    clientLoyalties,
    isLoading,
    enrollClient: enrollMutation.mutate,
    enrollClientAsync: enrollMutation.mutateAsync,
    unenrollClient: unenrollMutation.mutate,
    addPoints: addPointsMutation.mutate,
    addPointsAsync: addPointsMutation.mutateAsync,
    redeemReward: redeemRewardMutation.mutate,
    checkEligibility,
    getBestDiscount,
    getClientEnrollments,
    getPlanClients,
    isEnrolling: enrollMutation.isPending,
    isUpdating: addPointsMutation.isPending
  };
}

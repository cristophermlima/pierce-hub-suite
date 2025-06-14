
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface LoyaltyPlan {
  id: string;
  name: string;
  description: string;
  conditions: any;
  reward: any;
  active: boolean;
  custom_reward_type?: string;
  created_at: string;
  updated_at: string;
}

export function useLoyaltyPlans() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['loyalty-plans'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from('loyalty_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        toast({ title: "Erro ao buscar planos", description: error.message, variant: "destructive" });
        return [];
      }
      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (plan: Partial<LoyaltyPlan>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      const insertPlan = {
        user_id: user.id,
        name: plan.name || "",
        description: plan.description || "",
        reward: plan.reward ?? null,
        conditions: plan.conditions ?? null,
        active: plan.active ?? true,
        custom_reward_type: plan.custom_reward_type || null,
      };
      const { error, data } = await supabase
        .from('loyalty_plans')
        .insert(insertPlan)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-plans'] });
      toast({ title: "Plano salvo", description: "Seu plano foi salvo com sucesso." });
    },
    onError: err => toast({ title: "Erro ao salvar plano", description: err.message, variant: "destructive" })
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, plan }: { id: string, plan: Partial<LoyaltyPlan> }) => {
      const { error } = await supabase
        .from('loyalty_plans')
        .update({
          name: plan.name,
          description: plan.description,
          reward: plan.reward,
          conditions: plan.conditions,
          active: plan.active,
          custom_reward_type: plan.custom_reward_type,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-plans'] });
      toast({ title: "Plano atualizado", description: "Plano editado com sucesso!" });
    },
    onError: err => toast({ title: "Erro ao atualizar plano", description: err.message, variant: "destructive" })
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('loyalty_plans')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-plans'] });
      toast({ title: "Plano apagado", description: "Plano removido com sucesso!" });
    }
  });

  return {
    plans,
    isLoading,
    createPlan: createMutation.mutate,
    editPlan: editMutation.mutate,
    deletePlan: deleteMutation.mutate,
    creating: createMutation.isPending,
    editing: editMutation.isPending
  };
}


import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LoyaltyClient {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  visits: number;
  lastVisit: string | null;
  birthDate: string | null;
  loyaltyLevel: 'novo' | 'regular' | 'frequente' | 'vip';
  nextReward: string;
  discountEligible: boolean;
}

export interface LoyaltyPromotion {
  id: string;
  title: string;
  description: string;
  condition: string;
  reward: string;
  active: boolean;
  visitThreshold?: number;
  discountPercentage?: number;
}

export function useLoyalty() {
  const queryClient = useQueryClient();

  // Buscar clientes com informações de fidelidade
  const { data: loyaltyClients = [], isLoading } = useQuery({
    queryKey: ['loyalty-clients'],
    queryFn: async (): Promise<LoyaltyClient[]> => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('visits', { ascending: false });

      if (error) throw error;

      return data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        visits: client.visits || 0,
        lastVisit: client.last_visit,
        birthDate: client.birth_date,
        loyaltyLevel: getLoyaltyLevel(client.visits || 0),
        nextReward: getNextReward(client.visits || 0),
        discountEligible: isDiscountEligible(client.visits || 0)
      }));
    },
  });

  // Promoções de fidelidade
  const loyaltyPromotions: LoyaltyPromotion[] = [
    {
      id: '1',
      title: 'Desconto na Segunda Visita',
      description: '15% de desconto em qualquer serviço na segunda visita',
      condition: 'Segunda visita',
      reward: '15% de desconto',
      active: true,
      visitThreshold: 2,
      discountPercentage: 15
    },
    {
      id: '2',
      title: 'Cliente Fiel',
      description: 'Após 5 visitas, ganhe um piercing básico gratuito',
      condition: '5 visitas',
      reward: '1 piercing básico grátis',
      active: true,
      visitThreshold: 5
    },
    {
      id: '3',
      title: 'Aniversariante do Mês',
      description: 'No mês do seu aniversário, ganhe 20% de desconto',
      condition: 'Aniversário no mês',
      reward: '20% de desconto',
      active: true,
      discountPercentage: 20
    }
  ];

  // Atualizar visitas do cliente
  const updateClientVisitsMutation = useMutation({
    mutationFn: async ({ clientId }: { clientId: string }) => {
      const { data: client, error: fetchError } = await supabase
        .from('clients')
        .select('visits')
        .eq('id', clientId)
        .single();

      if (fetchError) throw fetchError;

      const { error: updateError } = await supabase
        .from('clients')
        .update({ 
          visits: (client.visits || 0) + 1,
          last_visit: new Date().toISOString()
        })
        .eq('id', clientId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  // Verificar desconto aplicável para cliente
  const getClientDiscount = (client: LoyaltyClient): { discount: number, reason: string } | null => {
    // Verificar aniversário do mês
    if (client.birthDate && isBirthdayMonth(client.birthDate)) {
      return { discount: 20, reason: 'Aniversariante do Mês' };
    }

    // Verificar segunda visita
    if (client.visits === 1) {
      return { discount: 15, reason: 'Segunda Visita' };
    }

    return null;
  };

  // Verificar clientes aniversariantes do mês
  const getBirthdayClients = (): LoyaltyClient[] => {
    return loyaltyClients.filter(client => 
      client.birthDate && isBirthdayMonth(client.birthDate)
    );
  };

  return {
    loyaltyClients,
    loyaltyPromotions,
    isLoading,
    updateClientVisits: updateClientVisitsMutation.mutate,
    getClientDiscount,
    getBirthdayClients
  };
}

// Funções auxiliares
function getLoyaltyLevel(visits: number): 'novo' | 'regular' | 'frequente' | 'vip' {
  if (visits >= 10) return 'vip';
  if (visits >= 5) return 'frequente';
  if (visits >= 1) return 'regular';
  return 'novo';
}

function getNextReward(visits: number): string {
  if (visits === 1) return 'Desconto na Segunda Visita (15%)';
  if (visits >= 2 && visits < 5) return 'Cliente Fiel (Piercing grátis em 5 visitas)';
  if (visits >= 5) return 'Cliente VIP - Benefícios especiais';
  return 'Complete sua primeira visita';
}

function isDiscountEligible(visits: number): boolean {
  return visits === 1; // Segunda visita
}

function isBirthdayMonth(birthDate: string): boolean {
  const birth = new Date(birthDate);
  const now = new Date();
  return birth.getMonth() === now.getMonth();
}

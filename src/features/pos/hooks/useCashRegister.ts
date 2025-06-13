
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { startOfDay, endOfDay } from 'date-fns';

interface CashRegister {
  id: string;
  cashier: string;
  initial_amount: number;
  final_amount?: number;
  difference?: number;
  notes?: string;
  isOpen: boolean;
  opened_at: string;
  closed_at?: string;
}

interface Sale {
  id: string;
  total: number;
  payment_method: string;
  created_at: string;
  client_id?: string;
}

export function useCashRegister() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cashRegisterDialogOpen, setCashRegisterDialogOpen] = useState(false);

  // Buscar caixa do dia atual
  const { data: cashRegister, isLoading } = useQuery({
    queryKey: ['current-cash-register'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const today = new Date();
      const startDay = startOfDay(today).toISOString();
      const endDay = endOfDay(today).toISOString();

      const { data, error } = await supabase
        .from('cash_registers')
        .select('*')
        .eq('user_id', user.id)
        .gte('opened_at', startDay)
        .lte('opened_at', endDay)
        .order('opened_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar caixa:', error);
        return null;
      }

      return data ? {
        ...data,
        isOpen: data.is_open
      } : null;
    },
  });

  // Mutation para abrir caixa
  const openRegisterMutation = useMutation({
    mutationFn: async ({ cashier, initialAmount, notes }: { 
      cashier: string; 
      initialAmount: number; 
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('cash_registers')
        .insert({
          user_id: user.id,
          cashier,
          initial_amount: initialAmount,
          notes,
          is_open: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-cash-register'] });
      toast({
        title: "Caixa aberto",
        description: "O caixa foi aberto com sucesso.",
      });
      setCashRegisterDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao abrir caixa",
        description: "Não foi possível abrir o caixa. Tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao abrir caixa:', error);
    },
  });

  // Mutation para fechar caixa
  const closeRegisterMutation = useMutation({
    mutationFn: async ({ registerId, finalAmount, notes }: { 
      registerId: string; 
      finalAmount: number; 
      notes?: string;
    }) => {
      const difference = finalAmount - (cashRegister?.initial_amount || 0);
      
      const { error } = await supabase
        .from('cash_registers')
        .update({
          final_amount: finalAmount,
          difference,
          notes,
          is_open: false,
          closed_at: new Date().toISOString()
        })
        .eq('id', registerId);

      if (error) throw error;
      return { finalAmount, difference };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-cash-register'] });
      toast({
        title: "Caixa fechado",
        description: "O caixa foi fechado com sucesso.",
      });
      setCashRegisterDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao fechar caixa",
        description: "Não foi possível fechar o caixa. Tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao fechar caixa:', error);
    },
  });

  const handleOpenCashRegister = (cashier: string, initialAmount: number, notes?: string) => {
    openRegisterMutation.mutate({ cashier, initialAmount, notes });
  };

  const handleCloseCashRegister = (finalAmount: number, notes?: string) => {
    if (!cashRegister?.id) return;
    closeRegisterMutation.mutate({ 
      registerId: cashRegister.id, 
      finalAmount, 
      notes 
    });
  };

  const addSaleToCashRegister = async (sale: Sale) => {
    if (!cashRegister?.id) return;

    // Associar venda ao caixa
    await supabase
      .from('sales')
      .update({ cash_register_id: cashRegister.id })
      .eq('id', sale.id);
  };

  return {
    cashRegister,
    isLoading,
    cashRegisterDialogOpen,
    setCashRegisterDialogOpen,
    handleOpenCashRegister,
    handleCloseCashRegister,
    addSaleToCashRegister,
    isOpeningRegister: openRegisterMutation.isPending,
    isClosingRegister: closeRegisterMutation.isPending
  };
}

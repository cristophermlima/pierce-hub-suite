
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
  currentAmount?: number;
  sales?: any[];
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
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar caixa:', error);
        return null;
      }

      if (!data) return null;

      // Buscar vendas do caixa
      const { data: sales } = await supabase
        .from('sales')
        .select('*')
        .eq('cash_register_id', data.id);

      const totalSales = sales?.reduce((acc, sale) => acc + Number(sale.total), 0) || 0;

      return {
        ...data,
        isOpen: data.is_open,
        currentAmount: data.initial_amount + totalSales,
        sales: sales || []
      };
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

      console.log('Tentando abrir caixa:', { cashier, initialAmount, notes });

      const { data, error } = await supabase
        .from('cash_registers')
        .insert({
          user_id: user.id,
          cashier,
          initial_amount: initialAmount,
          notes: notes || '',
          is_open: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir caixa:', error);
        throw error;
      }

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
    onError: (error: any) => {
      console.error('Erro completo ao abrir caixa:', error);
      toast({
        title: "Erro ao abrir caixa",
        description: error.message || "Não foi possível abrir o caixa. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation para fechar caixa
  const closeRegisterMutation = useMutation({
    mutationFn: async ({ finalAmount, notes }: { 
      finalAmount: number; 
      notes?: string;
    }) => {
      if (!cashRegister?.id) throw new Error('Nenhum caixa aberto encontrado');

      const expectedAmount = cashRegister.currentAmount ?? cashRegister.initial_amount;
      const difference = finalAmount - expectedAmount;
      
      const { error } = await supabase
        .from('cash_registers')
        .update({
          final_amount: finalAmount,
          difference,
          notes: notes || '',
          is_open: false,
          closed_at: new Date().toISOString()
        })
        .eq('id', cashRegister.id);

      if (error) throw error;
      return { finalAmount, difference };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-cash-register'] });
      toast({
        title: "Caixa fechado",
        description: "O caixa foi fechado com sucesso.",
      });
      // Mantém o dialog aberto para exibir/imprimir o relatório (o usuário fecha manualmente)
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao fechar caixa",
        description: error.message || "Não foi possível fechar o caixa. Tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao fechar caixa:', error);
    },
  });

  const handleOpenCashRegister = (cashier: string, initialAmount: number, notes?: string) => {
    console.log('handleOpenCashRegister chamado:', { cashier, initialAmount, notes });
    openRegisterMutation.mutate({ cashier, initialAmount, notes });
  };

  const handleCloseCashRegister = (finalAmount: number, notes?: string) => {
    console.log('handleCloseCashRegister chamado:', { finalAmount, notes });
    closeRegisterMutation.mutate({ finalAmount, notes });
  };

  const addSaleToCashRegister = async (sale: any) => {
    if (!cashRegister?.id) return;

    // Associar venda ao caixa
    await supabase
      .from('sales')
      .update({ cash_register_id: cashRegister.id })
      .eq('id', sale.id);

    // Invalidar queries para atualizar dados
    queryClient.invalidateQueries({ queryKey: ['current-cash-register'] });
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

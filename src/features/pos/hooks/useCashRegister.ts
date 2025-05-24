
import { useState, useEffect } from 'react';
import { CashRegister } from '../types';
import { useToast } from "@/components/ui/use-toast";

export const useCashRegister = () => {
  const { toast } = useToast();
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
  const [cashRegisterDialogOpen, setCashRegisterDialogOpen] = useState(false);

  // Verificar se o caixa está aberto quando carrega a página
  useEffect(() => {
    // Aqui seria ideal buscar o estado do caixa do servidor/banco
    // Por enquanto, exibimos um diálogo para abrir o caixa se não estiver aberto
    if (!cashRegister) {
      setCashRegisterDialogOpen(true);
    }
  }, []);

  // Função para abrir o caixa
  const handleOpenCashRegister = (initialAmount: number) => {
    const newCashRegister: CashRegister = {
      id: Date.now(),
      openedAt: new Date(),
      initialAmount: initialAmount,
      currentAmount: initialAmount,
      isOpen: true,
      sales: [],
      cashier: "Operador" // Idealmente viria do formulário/usuário logado
    };
    
    setCashRegister(newCashRegister);
    toast({
      title: "Caixa aberto",
      description: `Caixa aberto com valor inicial de R$ ${initialAmount.toFixed(2)}`,
    });
  };

  // Função para fechar o caixa
  const handleCloseCashRegister = (data: { finalAmount: number; notes: string }) => {
    setCashRegister(prev => {
      if (!prev) return prev;
      
      const expected = prev.initialAmount + prev.sales.reduce((acc, sale) => acc + sale.total, 0);
      const difference = data.finalAmount - expected;
      
      // Registrar diferença no caixa, se houver
      let message = `Caixa fechado. Valor final: R$ ${data.finalAmount.toFixed(2)}`;
      if (Math.abs(difference) > 0.01) { // consider small floating point errors
        const diffType = difference > 0 ? "sobra" : "falta";
        message += `. ${diffType} de R$ ${Math.abs(difference).toFixed(2)}`;
      }
      
      toast({
        title: "Caixa fechado",
        description: message,
      });
      
      return {
        ...prev,
        isOpen: false,
        closedAt: new Date(),
        currentAmount: data.finalAmount
      };
    });
  };

  const addSaleToCashRegister = (sale: any) => {
    setCashRegister(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        currentAmount: prev.currentAmount + sale.total,
        sales: [...prev.sales, sale]
      };
    });
  };

  return {
    cashRegister,
    cashRegisterDialogOpen,
    setCashRegisterDialogOpen,
    handleOpenCashRegister,
    handleCloseCashRegister,
    addSaleToCashRegister,
  };
};

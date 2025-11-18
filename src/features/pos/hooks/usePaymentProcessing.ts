
import { useState } from 'react';
import { CartItem, Sale } from '../types';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useProcedureMaterials } from './useProcedureMaterials';

export const usePaymentProcessing = () => {
  const { toast } = useToast();
  const { saveProcedureCosts } = useProcedureMaterials();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [procedureCostsDialogOpen, setProcedureCostsDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [pendingSaleData, setPendingSaleData] = useState<{
    cartItems: CartItem[];
    total: number;
    onSaleComplete: (sale: Sale) => void;
  } | null>(null);

  const handlePaymentClick = (method: string, cashRegister: any) => {
    if (!cashRegister?.isOpen) {
      toast({
        title: "Caixa fechado",
        description: "O caixa precisa estar aberto para processar vendas.",
        variant: "destructive",
      });
      return false;
    }

    setPaymentMethod(method);
    setPaymentDialogOpen(true);
    return true;
  };

  const processPayment = async (
    cartItems: CartItem[],
    total: number,
    paymentMethodParam: string,
    onSaleComplete: (sale: Sale) => void
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();
      
      // Salvar venda no Supabase
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          user_id: user.id,
          total: total,
          payment_method: paymentMethodParam,
          created_at: now.toISOString()
        })
        .select()
        .single();

      if (saleError) {
        console.error('Erro ao salvar venda:', saleError);
        toast({
          title: "Erro ao processar venda",
          description: "Não foi possível salvar a venda no banco de dados.",
          variant: "destructive",
        });
        return;
      }

      console.log('Venda salva com sucesso:', saleData);

      // Salvar itens da venda
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from('sale_items')
          .insert({
            sale_id: saleData.id,
            product_id: item.originalId,
            quantity: item.quantity,
            price: item.price
          });

        if (itemError) {
          console.error('Erro ao salvar item da venda:', itemError);
        }
      }

      // Criar objeto Sale local para exibição
      const saleForDisplay: Sale = {
        id: saleData.id,
        items: [...cartItems],
        total: total,
        paymentMethod: paymentMethodParam,
        payment_method: paymentMethodParam,
        timestamp: now.toISOString(),
        created_at: now.toISOString(),
        date: now,
        user_id: user.id,
        cash_register_id: saleData.cash_register_id
      };
      
      setCurrentSale(saleForDisplay);
      setPaymentDialogOpen(false);
      
      // Armazenar dados para possível registro de custos
      setPendingSaleData({ cartItems, total, onSaleComplete });
      
      // Verificar se há serviços na venda para abrir diálogo de custos
      const hasServices = cartItems.some(item => item.is_service);
      if (hasServices) {
        setProcedureCostsDialogOpen(true);
      } else {
        setReceiptOpen(true);
        onSaleComplete(saleForDisplay);
      }
      
      toast({
        title: "Pagamento processado",
        description: `Venda #${saleData.id.slice(0, 8)} realizada com sucesso!`,
      });
    } catch (error) {
      console.error('Erro inesperado ao processar pagamento:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao processar o pagamento.",
        variant: "destructive",
      });
    }
  };

  const handleProcedureCostsSave = async (costs: any[], notes: string) => {
    if (!currentSale || !pendingSaleData) return;

    try {
      // Salvar custos do procedimento
      if (costs.length > 0) {
        await saveProcedureCosts(currentSale.id, costs);
      }

      // Salvar observações do procedimento se houver
      if (notes.trim()) {
        await supabase
          .from('sales')
          .update({ procedure_notes: notes })
          .eq('id', currentSale.id);
      }

      setProcedureCostsDialogOpen(false);
      setReceiptOpen(true);
      pendingSaleData.onSaleComplete(currentSale);
      setPendingSaleData(null);

      if (costs.length > 0) {
        toast({
          title: "Custos registrados",
          description: "Os custos do procedimento foram salvos com sucesso!",
        });
      }
    } catch (error) {
      console.error('Erro ao salvar custos do procedimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar custos do procedimento.",
        variant: "destructive",
      });
    }
  };

  const finishSale = (onClearCart: () => void) => {
    onClearCart();
    setReceiptOpen(false);
    setPendingSaleData(null);
    
    toast({
      title: "Venda finalizada",
      description: "Todos os itens do carrinho foram limpos",
    });
  };

  const sendToWhatsApp = () => {
    if (!currentSale) return;
    
    const items = currentSale.items.map(item => 
      `${item.name} (${item.quantity}x R$ ${item.price.toFixed(2)}) = R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `*Comprovante de Compra - PiercerHub*\n\n` +
                   `*Venda #${currentSale.id.slice(0, 8)}*\n` +
                   `*Data:* ${currentSale.date.toLocaleDateString()} ${currentSale.date.toLocaleTimeString()}\n\n` +
                   `*Itens:*\n${items}\n\n` +
                   `*Total:* R$ ${currentSale.total.toFixed(2)}\n` +
                   `*Forma de Pagamento:* ${currentSale.paymentMethod}\n\n` +
                   `Obrigado pela preferência!`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return {
    paymentDialogOpen,
    setPaymentDialogOpen,
    receiptOpen,
    setReceiptOpen,
    procedureCostsDialogOpen,
    setProcedureCostsDialogOpen,
    paymentMethod,
    setPaymentMethod,
    currentSale,
    handlePaymentClick,
    processPayment,
    handleProcedureCostsSave,
    finishSale,
    sendToWhatsApp,
  };
};

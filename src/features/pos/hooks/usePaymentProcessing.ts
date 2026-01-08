import { CartItem, Sale } from '../types';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { getEffectiveUserId } from '@/lib/effectiveUser';

export interface PaymentDetails {
  cardType?: 'credito' | 'debito';
  cardBrand?: string;
  receiptNumber?: string;
}

/**
 * Hook responsável apenas por processar o pagamento e registrar a venda.
 * Toda a parte de UI (dialogs, recibo, WhatsApp, etc.) fica no componente que o consome.
 */
export const usePaymentProcessing = () => {
  const { toast } = useToast();

  const processPayment = async (
    cartItems: CartItem[],
    total: number,
    paymentMethodParam: string,
    onSaleComplete: (sale: Sale) => void,
    paymentDetails?: PaymentDetails,
    cashRegisterId?: string
  ) => {
    try {
      let effectiveUserId: string;
      try {
        effectiveUserId = await getEffectiveUserId();
      } catch (e) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      const now = new Date();

      // Salvar venda no Supabase com dados do cartão se aplicável
      const saleInsert: any = {
        user_id: effectiveUserId,
        total: total,
        payment_method: paymentMethodParam,
        created_at: now.toISOString(),
        ...(cashRegisterId ? { cash_register_id: cashRegisterId } : {}),
      };

      // Adicionar dados do cartão se for pagamento com cartão
      if (paymentMethodParam === 'Cartão' && paymentDetails) {
        saleInsert.card_type = paymentDetails.cardType;
        saleInsert.card_brand = paymentDetails.cardBrand;
        saleInsert.receipt_number = paymentDetails.receiptNumber;
      }

      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert(saleInsert)
        .select()
        .single();

      if (saleError || !saleData) {
        console.error('Erro ao salvar venda:', saleError);
        toast({
          title: "Erro ao processar venda",
          description: "Não foi possível salvar a venda no banco de dados.",
          variant: "destructive",
        });
        return;
      }

      // Salvar itens da venda
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from('sale_items')
          .insert({
            sale_id: saleData.id,
            product_id: item.originalId,
            quantity: item.quantity,
            price: item.price,
          });

        if (itemError) {
          console.error('Erro ao salvar item da venda:', itemError);
        }
      }

      // Objeto de venda usado apenas no frontend
      const saleForDisplay: Sale = {
        id: saleData.id,
        items: [...cartItems],
        total: total,
        paymentMethod: paymentMethodParam,
        payment_method: paymentMethodParam,
        timestamp: now.toISOString(),
        created_at: now.toISOString(),
        date: now,
        user_id: effectiveUserId,
        cash_register_id: saleData.cash_register_id,
      };

      // Notificar o componente chamador (POS) para exibir o recibo
      onSaleComplete(saleForDisplay);

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

  return {
    processPayment,
  };
};

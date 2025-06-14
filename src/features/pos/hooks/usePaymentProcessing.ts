
import { useState } from 'react';
import { CartItem, Sale } from '../types';
import { useToast } from "@/components/ui/use-toast";

export const usePaymentProcessing = () => {
  const { toast } = useToast();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);

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

  const processPayment = (
    cartItems: CartItem[],
    total: number,
    onSaleComplete: (sale: Sale) => void
  ) => {
    const now = new Date();
    // Criar nova venda com todos os campos do tipo Sale
    const saleData: Sale = {
      id: Date.now().toString(),
      items: [...cartItems],
      total: total,
      paymentMethod: paymentMethod,
      payment_method: paymentMethod,
      timestamp: now.toISOString(),
      created_at: now.toISOString(),
      date: now,
    };
    
    setCurrentSale(saleData);
    setPaymentDialogOpen(false);
    setReceiptOpen(true);
    
    onSaleComplete(saleData);
    
    toast({
      title: "Pagamento processado",
      description: `Venda #${saleData.id} realizada com sucesso!`,
    });
  };

  const finishSale = (onClearCart: () => void) => {
    onClearCart();
    setReceiptOpen(false);
    
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
                   `*Venda #${currentSale.id}*\n` +
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
    paymentMethod,
    currentSale,
    handlePaymentClick,
    processPayment,
    finishSale,
    sendToWhatsApp,
  };
};

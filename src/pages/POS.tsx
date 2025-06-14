
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Lock, Unlock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProductsList from '@/features/pos/components/ProductsList';
import Cart from '@/features/pos/components/Cart';
import PaymentDialog from '@/features/pos/components/PaymentDialog';
import ReceiptSheet from '@/features/pos/components/ReceiptSheet';
import { usePOSState, useCartState, usePaymentProcessing, useCashRegister } from '@/features/pos/hooks';

const POS = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    selectedClient,
    setSelectedClient,
    paymentDialogOpen,
    setPaymentDialogOpen,
    receiptSheetOpen,
    setReceiptSheetOpen,
    currentSale,
    setCurrentSale
  } = usePOSState();

  const {
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCartState();

  const { processPayment, isProcessing } = usePaymentProcessing();

  const {
    isOpen: cashRegisterOpen,
    openingAmount,
    openCashRegister,
    closeCashRegister,
    isOpening,
    isClosing,
    showCloseDialog,
    setShowCloseDialog
  } = useCashRegister();

  const handlePayment = async (paymentMethod: string, clientData?: any) => {
    if (!cashRegisterOpen) {
      toast({
        title: "Caixa Fechado",
        description: "Não é possível processar vendas com o caixa fechado.",
        variant: "destructive"
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar a venda.",
        variant: "destructive"
      });
      return;
    }

    const sale = await processPayment(cart, cartTotal, paymentMethod, clientData);
    if (sale) {
      setCurrentSale(sale);
      clearCart();
      setPaymentDialogOpen(false);
      setReceiptSheetOpen(true);
      
      // Invalidate queries to refresh stock
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  };

  const handleSendToWhatsApp = () => {
    if (!currentSale) return;
    
    const message = `*Comprovante de Venda*\n\nVenda #${currentSale.id.slice(0, 8)}\nData: ${currentSale.date.toLocaleDateString()}\n\n*Itens:*\n${currentSale.items.map(item => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\n*Total: R$ ${currentSale.total.toFixed(2)}*\n*Pagamento: ${currentSale.paymentMethod}*`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFinishSale = () => {
    setReceiptSheetOpen(false);
    setCurrentSale(null);
  };

  if (!cashRegisterOpen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold">Caixa Fechado</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              O caixa precisa estar aberto para processar vendas.
            </p>
            <Button 
              onClick={() => openCashRegister(0)}
              disabled={isOpening}
              className="w-full"
            >
              <Unlock className="mr-2 h-4 w-4" />
              {isOpening ? 'Abrindo...' : 'Abrir Caixa'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cash Register Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge 
            variant="outline" 
            className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
          >
            <DollarSign className="mr-1 h-3 w-3" />
            Caixa Aberto
          </Badge>
          {openingAmount !== null && (
            <span className="text-sm text-muted-foreground">
              Valor inicial: R$ {openingAmount.toFixed(2)}
            </span>
          )}
        </div>
        <Button 
          onClick={() => setShowCloseDialog(true)}
          variant="outline"
          disabled={isClosing}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Lock className="mr-2 h-4 w-4" />
          {isClosing ? 'Fechando...' : 'Fechar Caixa'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductsList onAddToCart={addToCart} />
        </div>
        
        <div className="lg:col-span-1">
          <Cart
            items={cart}
            total={cartTotal}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setPaymentDialogOpen(true)}
            selectedClient={selectedClient}
            onClientChange={setSelectedClient}
          />
        </div>
      </div>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        total={cartTotal}
        onPayment={handlePayment}
        isProcessing={isProcessing}
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
      />

      <ReceiptSheet
        open={receiptSheetOpen}
        onOpenChange={setReceiptSheetOpen}
        currentSale={currentSale}
        onFinishSale={handleFinishSale}
        onSendToWhatsApp={handleSendToWhatsApp}
      />

      {/* Close Cash Register Dialog */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Fechar Caixa
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja fechar o caixa? Isso impedirá o processamento de novas vendas até que seja reaberto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => closeCashRegister()}>
              Fechar Caixa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default POS;


import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, DollarSign, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProductsList from '@/features/pos/components/ProductsList';
import Cart from '@/features/pos/components/Cart';
import PaymentDialog from '@/features/pos/components/PaymentDialog';
import ReceiptSheet from '@/features/pos/components/ReceiptSheet';
import CashRegisterDialog from '@/features/pos/components/CashRegisterDialog';
import { usePOSState } from '@/features/pos/hooks/usePOSState';
import { usePaymentProcessing } from '@/features/pos/hooks/usePaymentProcessing';
import { useCashRegister } from '@/features/pos/hooks/useCashRegister';

const POS = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Local state for POS dialogs
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptSheetOpen, setReceiptSheetOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const {
    cartItems,
    selectedClient,
    setSelectedClient,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    clearCart,
    updateClientVisits,
    clients
  } = usePOSState();

  const { processPayment } = usePaymentProcessing();

  const {
    cashRegister,
    cashRegisterDialogOpen,
    setCashRegisterDialogOpen,
    handleOpenCashRegister,
    handleCloseCashRegister,
    isOpeningRegister,
    isClosingRegister
  } = useCashRegister();

  const cartTotal = calculateTotal();
  const cashRegisterOpen = cashRegister?.isOpen || false;

  const handlePayment = async (paymentMethod: string, clientData?: any) => {
    if (!cashRegisterOpen) {
      toast({
        title: "Caixa Fechado",
        description: "Não é possível processar vendas com o caixa fechado.",
        variant: "destructive"
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar a venda.",
        variant: "destructive"
      });
      return;
    }

    try {
      const sale = await processPayment(cartItems, cartTotal, paymentMethod, (saleData) => {
        setCurrentSale(saleData);
        clearCart();
        setPaymentDialogOpen(false);
        setReceiptSheetOpen(true);
        
        // Invalidate queries to refresh stock
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento.",
        variant: "destructive"
      });
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

  const handleOpenCashRegisterClick = () => {
    setCashRegisterDialogOpen(true);
  };

  const handleCloseCashRegisterClick = () => {
    setShowCloseDialog(true);
  };

  const handleCheckout = () => {
    setPaymentDialogOpen(true);
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
              onClick={handleOpenCashRegisterClick}
              disabled={isOpeningRegister}
              className="w-full"
            >
              <Unlock className="mr-2 h-4 w-4" />
              {isOpeningRegister ? 'Abrindo...' : 'Abrir Caixa'}
            </Button>
          </CardContent>
        </Card>

        <CashRegisterDialog
          open={cashRegisterDialogOpen}
          onOpenChange={setCashRegisterDialogOpen}
          onOpenRegister={handleOpenCashRegister}
          onCloseRegister={handleCloseCashRegister}
          currentRegister={cashRegister}
        />
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
          {cashRegister?.initial_amount !== null && (
            <span className="text-sm text-muted-foreground">
              Valor inicial: R$ {cashRegister.initial_amount.toFixed(2)}
            </span>
          )}
        </div>
        <Button 
          onClick={handleCloseCashRegisterClick}
          variant="outline"
          disabled={isClosingRegister}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Lock className="mr-2 h-4 w-4" />
          {isClosingRegister ? 'Fechando...' : 'Fechar Caixa'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductsList onAddToCart={addToCart} />
        </div>
        
        <div className="lg:col-span-1">
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={(productId, quantity) => updateQuantity(productId, quantity)}
            onRemoveFromCart={removeFromCart}
            selectedClient={selectedClient}
            onClientChange={setSelectedClient}
            clients={clients}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onPayment={handlePayment}
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

      <CashRegisterDialog
        open={cashRegisterDialogOpen}
        onOpenChange={setCashRegisterDialogOpen}
        onOpenRegister={handleOpenCashRegister}
        onCloseRegister={handleCloseCashRegister}
        currentRegister={cashRegister}
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
            <AlertDialogAction onClick={() => setCashRegisterDialogOpen(true)}>
              Fechar Caixa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default POS;

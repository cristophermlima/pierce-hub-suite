
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
import { useAppSettings } from '@/context/AppSettingsContext';
import { useTranslation } from '@/hooks/useTranslation';

const POS = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { formatCurrency } = useAppSettings();
  const { t } = useTranslation();
  
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
    addSaleToCashRegister,
    isOpeningRegister,
    isClosingRegister
  } = useCashRegister();

  const cartTotal = calculateTotal();
  const cashRegisterOpen = cashRegister?.isOpen || false;

  const handlePayment = async (paymentMethod: string, paymentDetails?: any) => {
    if (!cashRegisterOpen) {
      toast({
        title: t('cashRegisterClosed'),
        description: t('cannotProcessSales'),
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: t('emptyCart'),
        description: t('addItemsFirst'),
        variant: "destructive",
      });
      return;
    }

    try {
      let saleCompleted: any = null;

      await processPayment(
        cartItems,
        cartTotal,
        paymentMethod,
        (saleData) => {
          saleCompleted = saleData;
          setCurrentSale(saleData);
          clearCart();
          setPaymentDialogOpen(false);
          setReceiptSheetOpen(true);

          // Invalidate queries to refresh stock
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['inventory'] });
          queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
        },
        paymentDetails,
        cashRegister?.id
      );

      // Fallback: se por algum motivo não salvou o cash_register_id no INSERT
      if (saleCompleted && !saleCompleted.cash_register_id) {
        try {
          await addSaleToCashRegister(saleCompleted);
        } catch (linkError) {
          console.error('Erro ao vincular venda ao caixa:', linkError);
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro",
        description: t('paymentError'),
        variant: "destructive",
      });
    }
  };

  const handleSendToWhatsApp = () => {
    if (!currentSale) return;
    
    const message = `*${t('saleReceipt')}*\n\n${t('sale')} #${currentSale.id.slice(0, 8)}\n${t('date')}: ${currentSale.date.toLocaleDateString()}\n\n*${t('items')}:*\n${currentSale.items.map(item => `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`).join('\n')}\n\n*${t('total')}: ${formatCurrency(currentSale.total)}*\n*${t('paymentMethod')}: ${currentSale.paymentMethod}*`;
    
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

  return (
    <div className="space-y-6">
      {!cashRegisterOpen ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Lock className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold">{t('cashRegisterClosed')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{t('cashRegisterMustBeOpen')}</p>
              <Button
                onClick={handleOpenCashRegisterClick}
                disabled={isOpeningRegister}
                className="w-full"
              >
                <Unlock className="mr-2 h-4 w-4" />
                {isOpeningRegister ? t('opening') : t('openCashRegister')}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Cash Register Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
              >
                <DollarSign className="mr-1 h-3 w-3" />
                {t('cashRegisterOpen')}
              </Badge>
              {cashRegister?.initial_amount !== null && (
                <span className="text-sm text-muted-foreground">
                  {t('initialAmount')}: {formatCurrency(cashRegister.initial_amount)}
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
              {isClosingRegister ? t('closing') : t('closeCashRegister')}
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

          {/* Close Cash Register Dialog */}
          <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {t('closeCashRegister')}
                </AlertDialogTitle>
                <AlertDialogDescription>{t('closeCashRegisterConfirm')}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={() => setCashRegisterDialogOpen(true)}>
                  {t('closeCashRegister')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Dialog do Caixa (sempre montado para não sumir o relatório ao fechar) */}
      <CashRegisterDialog
        open={cashRegisterDialogOpen}
        onOpenChange={setCashRegisterDialogOpen}
        onOpenRegister={handleOpenCashRegister}
        onCloseRegister={handleCloseCashRegister}
        currentRegister={cashRegister}
      />
    </div>
  );
};

export default POS;


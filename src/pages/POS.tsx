
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Importação dos componentes refatorados
import ProductsList from '@/features/pos/components/ProductsList';
import Cart from '@/features/pos/components/Cart';
import PaymentDialog from '@/features/pos/components/PaymentDialog';
import ReceiptSheet from '@/features/pos/components/ReceiptSheet';
import CashRegisterDialog from '@/features/pos/components/CashRegisterDialog';

// Importação dos hooks personalizados
import { usePOSState } from '@/features/pos/hooks/usePOSState';
import { useCashRegister } from '@/features/pos/hooks/useCashRegister';
import { usePaymentProcessing } from '@/features/pos/hooks/usePaymentProcessing';

const POS = () => {
  // Hooks personalizados para gerenciar o estado
  const {
    cartItems,
    searchQuery,
    setSearchQuery,
    selectedTab,
    setSelectedTab,
    localProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    clearCart,
    updateProductStock,
  } = usePOSState();

  const {
    cashRegister,
    cashRegisterDialogOpen,
    setCashRegisterDialogOpen,
    handleOpenCashRegister,
    handleCloseCashRegister,
    addSaleToCashRegister,
  } = useCashRegister();

  const {
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
  } = usePaymentProcessing();

  const total = calculateTotal();

  const onPaymentClick = (method: string) => {
    const success = handlePaymentClick(method, cashRegister);
    if (!success) {
      setCashRegisterDialogOpen(true);
    }
  };

  const onProcessPayment = () => {
    processPayment(cartItems, total, (sale) => {
      addSaleToCashRegister(sale);
      updateProductStock(cartItems);
    });
  };

  const onFinishSale = () => {
    finishSale(clearCart);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div className="space-y-6">
      {!cashRegister?.isOpen && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Caixa fechado</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>O caixa está fechado. É necessário abrir o caixa para iniciar as operações.</span>
            <Button size="sm" onClick={() => setCashRegisterDialogOpen(true)}>
              Abrir Caixa
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ponto de Venda</h2>
        <div className="space-x-2">
          {cashRegister?.isOpen ? (
            <Button variant="outline" onClick={() => setCashRegisterDialogOpen(true)}>
              Fechar Caixa
            </Button>
          ) : (
            <Button onClick={() => setCashRegisterDialogOpen(true)}>
              Abrir Caixa
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <Tabs defaultValue="all" className="mb-6" onValueChange={handleTabChange}>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="jewelry">Joias</TabsTrigger>
                <TabsTrigger value="care">Cuidados</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="accessories">Acessórios</TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar produtos..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <ProductsList 
              products={localProducts}
              onAddToCart={addToCart}
              selectedTab={selectedTab}
              searchQuery={searchQuery}
            />
          </Tabs>
        </div>

        <div>
          <Cart 
            cartItems={cartItems}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onPayment={onPaymentClick}
          />
        </div>
        
        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          paymentMethod={paymentMethod}
          total={total}
          onProcessPayment={onProcessPayment}
        />
        
        <ReceiptSheet
          open={receiptOpen}
          onOpenChange={setReceiptOpen}
          currentSale={currentSale}
          onFinishSale={onFinishSale}
          onSendToWhatsApp={sendToWhatsApp}
        />

        <CashRegisterDialog
          open={cashRegisterDialogOpen}
          onOpenChange={setCashRegisterDialogOpen}
          onOpenRegister={handleOpenCashRegister}
          onCloseRegister={handleCloseCashRegister}
          currentRegister={cashRegister}
        />
      </div>
    </div>
  );
};

export default POS;

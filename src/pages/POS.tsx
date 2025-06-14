
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Cart from '@/features/pos/components/Cart';
import { useCartState } from '@/features/pos/hooks/useCartState';
import { useInventory } from '@/features/inventory/hooks/useInventory';
import { useCashRegister } from '@/features/pos/hooks/useCashRegister';
import { usePaymentProcessing } from '@/features/pos/hooks/usePaymentProcessing';
import ProductCard from '@/features/pos/components/ProductCard';
import { ProcedureMaterialsDialog } from '@/features/pos/components/ProcedureMaterialsDialog';
import { ProcedureCostsDialog } from '@/features/pos/components/ProcedureCostsDialog';

const POS = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  
  const {
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
  } = usePaymentProcessing();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCartState();
  const { products, categories } = useInventory();
  const { cashRegister } = useCashRegister();

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(product => {
    const searchRegex = new RegExp(search, 'i');
    const categoryMatch = category ? product.category_id === category : true;
    return searchRegex.test(product.name) && categoryMatch;
  });

  const onSaleComplete = (sale: any) => {
    console.log('Sale completed:', sale);
    clearCart();
  };

  const handlePayment = (method: string) => {
    if (handlePaymentClick(method, cashRegister)) {
      processPayment(cartItems, total, onSaleComplete);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Header com botão para materiais */}
      <div className="lg:hidden p-4 bg-white border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Ponto de Venda</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMaterialDialogOpen(true)}
          >
            Materiais
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Caixa
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Caixa</SheetTitle>
                <SheetDescription>
                  Informações sobre o caixa atual.
                </SheetDescription>
              </SheetHeader>
              {cashRegister ? (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Status
                    </Label>
                    <Input
                      type="text"
                      id="status"
                      value={cashRegister?.isOpen ? 'Aberto' : 'Fechado'}
                      className="col-span-3"
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Caixa
                    </Label>
                    <Input
                      type="text"
                      id="cashier"
                      value={cashRegister?.cashier}
                      className="col-span-3"
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="initial" className="text-right">
                      Abertura
                    </Label>
                    <Input
                      type="number"
                      id="initial"
                      value={cashRegister?.initial_amount}
                      className="col-span-3"
                      disabled
                    />
                  </div>
                </div>
              ) : (
                <p>Carregando...</p>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Left Panel - Products */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div className="hidden lg:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Ponto de Venda</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setMaterialDialogOpen(true)}
            >
              Gerenciar Materiais
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  Caixa
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Caixa</SheetTitle>
                  <SheetDescription>
                    Informações sobre o caixa atual.
                  </SheetDescription>
                </SheetHeader>
                {cashRegister ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Status
                      </Label>
                      <Input
                        type="text"
                        id="status"
                        value={cashRegister?.isOpen ? 'Aberto' : 'Fechado'}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Caixa
                      </Label>
                      <Input
                        type="text"
                        id="cashier"
                        value={cashRegister?.cashier}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="initial" className="text-right">
                        Abertura
                      </Label>
                      <Input
                        type="number"
                        id="initial"
                        value={cashRegister?.initial_amount}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                  </div>
                ) : (
                  <p>Carregando...</p>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-4 gap-2">
          <Input
            type="search"
            placeholder="Pesquisar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow lg:max-w-xs"
          />
          <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            Filtros
          </Button>
        </div>

        {/* Filters */}
        {isFiltersOpen && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
              <CardDescription>Selecione as opções de filtro.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-full lg:w-96 p-4 lg:p-6 bg-white border-l">
        <Cart
          cartItems={cartItems}
          onRemoveFromCart={removeFromCart}
          onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity, products)}
          onPayment={handlePayment}
        />
      </div>

      {/* Dialogs */}
      <ProcedureMaterialsDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
      />

      <ProcedureCostsDialog
        open={procedureCostsDialogOpen}
        onOpenChange={setProcedureCostsDialogOpen}
        onSaveCosts={handleProcedureCostsSave}
      />
    </div>
  );
};

export default POS;

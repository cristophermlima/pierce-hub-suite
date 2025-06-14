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
import { Search, Filter, Package, Banknote, ShoppingCart, Menu, X } from 'lucide-react';
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
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  
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
  const { inventoryItems, categories } = useInventory();
  const { cashRegister } = useCashRegister();

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Convert inventory items to products format and handle undefined case
  const products = inventoryItems || [];
  
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
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header móvel melhorado */}
      <div className="lg:hidden sticky top-0 z-50 p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl border-b border-white/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Ponto de Venda</h1>
              <p className="text-xs text-white/80">Sistema de vendas</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMaterialDialogOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            >
              <Package className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Materiais</span>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
                  <Banknote className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Caixa</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-sm bg-white/95 backdrop-blur-lg border-l border-gray-200/50">
                <SheetHeader>
                  <SheetTitle className="text-gray-800">Informações do Caixa</SheetTitle>
                  <SheetDescription>
                    Status e detalhes do caixa atual.
                  </SheetDescription>
                </SheetHeader>
                {cashRegister ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right text-sm font-medium">
                        Status
                      </Label>
                      <div className="col-span-3">
                        <Badge variant={cashRegister?.isOpen ? "default" : "secondary"}>
                          {cashRegister?.isOpen ? 'Aberto' : 'Fechado'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cashier" className="text-right text-sm font-medium">
                        Operador
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
                      <Label htmlFor="initial" className="text-right text-sm font-medium">
                        Valor Inicial
                      </Label>
                      <Input
                        type="text"
                        id="initial"
                        value={`R$ ${cashRegister?.initial_amount?.toFixed(2) || '0,00'}`}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Carregando informações...</p>
                  </div>
                )}
              </SheetContent>
            </Sheet>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsMobileCartOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm lg:hidden relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Left Panel - Products com visual premium */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header desktop melhorado */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ponto de Venda
              </h1>
              <p className="text-gray-600 text-lg">Sistema de vendas moderno</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setMaterialDialogOpen(true)}
              className="bg-white/80 hover:bg-blue-50 border-blue-200 text-blue-700 shadow-md backdrop-blur-sm"
            >
              <Package className="h-4 w-4 mr-2" />
              Gerenciar Materiais
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-white/80 hover:bg-purple-50 border-purple-200 text-purple-700 shadow-md backdrop-blur-sm">
                  <Banknote className="h-4 w-4 mr-2" />
                  Caixa
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-sm bg-white/95 backdrop-blur-lg border-l border-gray-200/50">
                <SheetHeader>
                  <SheetTitle className="text-gray-800">Informações do Caixa</SheetTitle>
                  <SheetDescription>
                    Status e detalhes do caixa atual.
                  </SheetDescription>
                </SheetHeader>
                {cashRegister ? (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right text-sm font-medium">
                        Status
                      </Label>
                      <div className="col-span-3">
                        <Badge variant={cashRegister?.isOpen ? "default" : "secondary"}>
                          {cashRegister?.isOpen ? 'Aberto' : 'Fechado'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cashier" className="text-right text-sm font-medium">
                        Operador
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
                      <Label htmlFor="initial" className="text-right text-sm font-medium">
                        Valor Inicial
                      </Label>
                      <Input
                        type="text"
                        id="initial"
                        value={`R$ ${cashRegister?.initial_amount?.toFixed(2) || '0,00'}`}
                        className="col-span-3"
                        disabled
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Carregando informações...</p>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search and Filters melhorados */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative flex-grow w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Pesquisar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400 shadow-md backdrop-blur-sm text-base"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="bg-white/80 hover:bg-gray-50 border-gray-200 shadow-md backdrop-blur-sm w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Filters Card melhorado */}
        {isFiltersOpen && (
          <Card className="mb-6 bg-white/90 backdrop-blur-lg border-gray-200/50 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
              <CardDescription>Selecione as opções de filtro para refinar a busca.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="w-full bg-white/90 border-gray-200 focus:border-blue-400 backdrop-blur-sm">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-lg">
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories?.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Product List responsivo melhorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="transform hover:scale-105 transition-all duration-300 hover:z-10">
              <ProductCard product={product} onAddToCart={addToCart} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="p-6 bg-white/50 rounded-full mb-6 backdrop-blur-sm">
              <Package className="h-20 w-20 text-gray-300" />
            </div>
            <p className="text-xl font-medium mb-2">Nenhum produto encontrado</p>
            <p className="text-sm text-center max-w-md">Tente ajustar os filtros ou a busca para encontrar os produtos desejados</p>
          </div>
        )}
      </div>

      {/* Right Panel - Cart desktop melhorado */}
      <div className="hidden lg:block w-96 xl:w-[420px] bg-white/95 backdrop-blur-lg border-l border-gray-200/50 shadow-2xl">
        <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Carrinho</h2>
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {cartItems.length}
              </Badge>
            )}
          </div>
          <p className="text-sm opacity-90">
            {cartItems.length === 0 ? 'Adicione produtos ao carrinho' : `${cartItems.length} item(s) • Total: R$ ${total.toFixed(2)}`}
          </p>
        </div>
        
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-6">
            <Cart
              cartItems={cartItems}
              onRemoveFromCart={removeFromCart}
              onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity, products)}
              onPayment={handlePayment}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Cart Sheet melhorado */}
      <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-white/95 backdrop-blur-lg p-0">
          <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Carrinho</h2>
                {cartItems.length > 0 && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {cartItems.length}
                  </Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileCartOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm opacity-90">
              {cartItems.length === 0 ? 'Adicione produtos ao carrinho' : `${cartItems.length} item(s) • Total: R$ ${total.toFixed(2)}`}
            </p>
          </div>
          
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-6">
              <Cart
                cartItems={cartItems}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity, products)}
                onPayment={handlePayment}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

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

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
import { Search, Filter, Package, Banknote, ShoppingCart } from 'lucide-react';
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
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header móvel com gradiente */}
      <div className="lg:hidden p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <h1 className="text-xl font-bold">Ponto de Venda</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMaterialDialogOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Package className="h-4 w-4 mr-1" />
              Materiais
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Banknote className="h-4 w-4 mr-1" />
                  Caixa
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-sm bg-white">
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
      </div>

      {/* Left Panel - Products com visual melhorado */}
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header desktop */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Ponto de Venda</h1>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setMaterialDialogOpen(true)}
              className="bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
            >
              <Package className="h-4 w-4 mr-2" />
              Gerenciar Materiais
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-white hover:bg-purple-50 border-purple-200 text-purple-700">
                  <Banknote className="h-4 w-4 mr-2" />
                  Caixa
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-sm bg-white">
                {/* ... keep existing code (SheetContent content) */}
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

        {/* Search and Filters com visual melhorado */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative flex-grow lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Pesquisar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="bg-white hover:bg-gray-50 border-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Filters Card */}
        {isFiltersOpen && (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800">Filtros</CardTitle>
              <CardDescription>Selecione as opções de filtro para refinar a busca.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="w-full bg-white border-gray-200 focus:border-blue-400">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories?.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Product List com layout melhorado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="transform hover:scale-105 transition-transform duration-200">
              <ProductCard product={product} onAddToCart={addToCart} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Package className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou a busca</p>
          </div>
        )}
      </div>

      {/* Right Panel - Cart com visual melhorado */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 shadow-xl">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-xl font-bold">Carrinho</h2>
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                {cartItems.length}
              </Badge>
            )}
          </div>
          <p className="text-sm opacity-90">
            {cartItems.length === 0 ? 'Adicione produtos ao carrinho' : `${cartItems.length} item(s) selecionado(s)`}
          </p>
        </div>
        
        <div className="p-6">
          <Cart
            cartItems={cartItems}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity, products)}
            onPayment={handlePayment}
          />
        </div>
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

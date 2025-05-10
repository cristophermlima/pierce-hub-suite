
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Importação dos componentes refatorados
import ProductsList from '@/features/pos/components/ProductsList';
import Cart from '@/features/pos/components/Cart';
import PaymentDialog from '@/features/pos/components/PaymentDialog';
import ReceiptSheet from '@/features/pos/components/ReceiptSheet';
import { products } from '@/features/pos/data/products';
import { Product, CartItem, Sale } from '@/features/pos/types';

const POS = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Piercing Labret Titânio', category: 'Joias', price: 120.00, quantity: 1 },
    { id: 2, name: 'Piercing Septum Aço', category: 'Joias', price: 85.00, quantity: 1 },
    { id: 3, name: 'Aplicação', category: 'Serviços', price: 50.00, quantity: 1 }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Item adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
    });
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    
    toast({
      title: "Item removido",
      description: "Item removido do carrinho",
    });
  };

  const updateQuantity = (id: number, change: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const total = calculateTotal();
  
  const handlePaymentClick = (method: string) => {
    setPaymentMethod(method);
    setPaymentDialogOpen(true);
  };
  
  const processPayment = () => {
    const saleData: Sale = {
      id: Math.floor(Math.random() * 1000000),
      date: new Date(),
      items: [...cartItems],
      total: total,
      paymentMethod: paymentMethod,
    };
    
    setCurrentSale(saleData);
    setPaymentDialogOpen(false);
    setReceiptOpen(true);
    
    toast({
      title: "Pagamento processado",
      description: `Venda #${saleData.id} realizada com sucesso!`,
    });
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };
  
  const finishSale = () => {
    setCartItems([]);
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

  return (
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
            products={products}
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
          onPayment={handlePaymentClick}
        />
      </div>
      
      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        paymentMethod={paymentMethod}
        total={total}
        onProcessPayment={processPayment}
      />
      
      <ReceiptSheet
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        currentSale={currentSale}
        onFinishSale={finishSale}
        onSendToWhatsApp={sendToWhatsApp}
      />
    </div>
  );
};

export default POS;

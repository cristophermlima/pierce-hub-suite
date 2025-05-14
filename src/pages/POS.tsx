
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Importação dos componentes refatorados
import ProductsList from '@/features/pos/components/ProductsList';
import Cart from '@/features/pos/components/Cart';
import PaymentDialog from '@/features/pos/components/PaymentDialog';
import ReceiptSheet from '@/features/pos/components/ReceiptSheet';
import CashRegisterDialog from '@/features/pos/components/CashRegisterDialog';
import { products } from '@/features/pos/data/products';
import { Product, CartItem, Sale, CashRegister } from '@/features/pos/types';

const POS = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [cashRegisterDialogOpen, setCashRegisterDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');

  // Estado para o caixa
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([...products]);

  // Verificar se o caixa está aberto quando carrega a página
  useEffect(() => {
    // Aqui seria ideal buscar o estado do caixa do servidor/banco
    // Por enquanto, exibimos um diálogo para abrir o caixa se não estiver aberto
    if (!cashRegister) {
      setCashRegisterDialogOpen(true);
    }
  }, []);

  const addToCart = (product: Product) => {
    // Verifica se tem estoque suficiente (exceto serviços)
    if (product.category !== 'Serviços' && product.stock !== undefined && product.stock <= 0) {
      toast({
        title: "Estoque insuficiente",
        description: `${product.name} não possui unidades em estoque.`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    
    // Verifica se já tem no carrinho e se tem estoque para adicionar mais
    if (existingItem) {
      if (product.category !== 'Serviços' && 
          product.stock !== undefined && 
          existingItem.quantity >= product.stock) {
        toast({
          title: "Estoque insuficiente",
          description: `Estoque insuficiente para ${product.name}.`,
          variant: "destructive",
        });
        return;
      }

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
    const item = cartItems.find(item => item.id === id);
    
    // Se estamos aumentando a quantidade, verificamos o estoque
    if (change > 0 && item) {
      const product = localProducts.find(p => p.id === id);
      if (product?.category !== 'Serviços' && 
          product?.stock !== undefined && 
          item.quantity + change > product.stock) {
        toast({
          title: "Estoque insuficiente",
          description: `Estoque insuficiente para ${item.name}.`,
          variant: "destructive",
        });
        return;
      }
    }

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
    if (!cashRegister?.isOpen) {
      toast({
        title: "Caixa fechado",
        description: "O caixa precisa estar aberto para processar vendas.",
        variant: "destructive",
      });
      setCashRegisterDialogOpen(true);
      return;
    }

    setPaymentMethod(method);
    setPaymentDialogOpen(true);
  };
  
  const processPayment = () => {
    // Criar nova venda
    const saleData: Sale = {
      id: Math.floor(Math.random() * 1000000),
      date: new Date(),
      items: [...cartItems],
      total: total,
      paymentMethod: paymentMethod,
    };
    
    // Atualizar o caixa com a nova venda
    setCashRegister(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        currentAmount: prev.currentAmount + total,
        sales: [...prev.sales, saleData]
      };
    });

    // Atualizar estoque dos produtos vendidos
    const updatedProducts = localProducts.map(product => {
      const soldItem = cartItems.find(item => item.id === product.id);
      if (soldItem && product.category !== 'Serviços' && product.stock !== undefined) {
        return {
          ...product,
          stock: product.stock - soldItem.quantity
        };
      }
      return product;
    });
    
    setLocalProducts(updatedProducts);
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

  // Função para abrir o caixa
  const handleOpenCashRegister = (initialAmount: number) => {
    const newCashRegister: CashRegister = {
      id: Date.now(),
      openedAt: new Date(),
      initialAmount: initialAmount,
      currentAmount: initialAmount,
      isOpen: true,
      sales: [],
      cashier: "Operador" // Idealmente viria do formulário/usuário logado
    };
    
    setCashRegister(newCashRegister);
    toast({
      title: "Caixa aberto",
      description: `Caixa aberto com valor inicial de R$ ${initialAmount.toFixed(2)}`,
    });
  };

  // Função para fechar o caixa
  const handleCloseCashRegister = (data: { finalAmount: number; notes: string }) => {
    setCashRegister(prev => {
      if (!prev) return prev;
      
      const expected = prev.initialAmount + prev.sales.reduce((acc, sale) => acc + sale.total, 0);
      const difference = data.finalAmount - expected;
      
      // Registrar diferença no caixa, se houver
      let message = `Caixa fechado. Valor final: R$ ${data.finalAmount.toFixed(2)}`;
      if (Math.abs(difference) > 0.01) { // consider small floating point errors
        const diffType = difference > 0 ? "sobra" : "falta";
        message += `. ${diffType} de R$ ${Math.abs(difference).toFixed(2)}`;
      }
      
      toast({
        title: "Caixa fechado",
        description: message,
      });
      
      return {
        ...prev,
        isOpen: false,
        closedAt: new Date(),
        currentAmount: data.finalAmount
      };
    });
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

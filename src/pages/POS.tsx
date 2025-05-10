
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Minus, 
  X, 
  CreditCard, 
  Banknote, 
  ShoppingBag, 
  QrCode, 
  Printer, 
  Share2, 
  CheckCircle2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const POS = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Piercing Labret Titânio', price: 120.00, quantity: 1 },
    { id: 2, name: 'Piercing Septum Aço', price: 85.00, quantity: 1 },
    { id: 3, name: 'Aplicação', price: 50.00, quantity: 1 }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [currentSale, setCurrentSale] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');

  const products = [
    { id: 1, name: 'Piercing Labret Titânio', category: 'Joias', price: 120.00, stock: 15 },
    { id: 2, name: 'Piercing Septum Aço', category: 'Joias', price: 85.00, stock: 10 },
    { id: 4, name: 'Barbell Industrial Aço', category: 'Joias', price: 95.00, stock: 8 },
    { id: 5, name: 'Captive Ring Titânio', category: 'Joias', price: 110.00, stock: 12 },
    { id: 6, name: 'Kit Cuidados Pós-Piercing', category: 'Cuidados', price: 45.00, stock: 20 },
    { id: 7, name: 'Soro Fisiológico 250ml', category: 'Cuidados', price: 15.00, stock: 30 },
    { id: 8, name: 'Aplicação', category: 'Serviços', price: 50.00, stock: 999 },
    { id: 9, name: 'Piercing Nostril Titânio', category: 'Joias', price: 90.00, stock: 18 },
    { id: 10, name: 'Piercing Tragus Aço', category: 'Joias', price: 75.00, stock: 22 },
    { id: 11, name: 'Espelho de Mão', category: 'Acessórios', price: 25.00, stock: 15 },
    { id: 12, name: 'Pinça Profissional', category: 'Acessórios', price: 65.00, stock: 8 },
  ];

  const filteredProducts = products.filter(product => {
    if (selectedTab !== 'all' && 
        selectedTab === 'jewelry' && product.category !== 'Joias' ||
        selectedTab === 'care' && product.category !== 'Cuidados' ||
        selectedTab === 'services' && product.category !== 'Serviços' ||
        selectedTab === 'accessories' && product.category !== 'Acessórios') {
      return false;
    }
    
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const addToCart = (product) => {
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

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    
    toast({
      title: "Item removido",
      description: "Item removido do carrinho",
    });
  };

  const updateQuantity = (id, change) => {
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
  
  const handlePaymentClick = (method) => {
    setPaymentMethod(method);
    setPaymentDialogOpen(true);
  };
  
  const processPayment = () => {
    const saleData = {
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

  const handleTabChange = (value) => {
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
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden border border-border">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription>
                      {product.category} · Estoque: {product.stock}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="jewelry" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden border border-border">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription>
                      {product.category} · Estoque: {product.stock}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="care" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden border border-border">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription>
                      {product.category} · Estoque: {product.stock}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden border border-border">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription>
                      {product.category}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="accessories" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden border border-border">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription>
                      {product.category} · Estoque: {product.stock}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between p-4 pt-0">
                    <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Carrinho</CardTitle>
              <ShoppingBag className="h-5 w-5" />
            </div>
            <CardDescription>
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no carrinho
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {cartItems.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-muted-foreground">Nenhum item no carrinho</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-16 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span>R$ {item.price.toFixed(2)}</span>
                            <span className="mx-2">×</span>
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                disabled={cartItems.length === 0}
                onClick={() => handlePaymentClick('Cartão de Crédito')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Cartão
              </Button>
              <Button 
                variant="outline" 
                disabled={cartItems.length === 0}
                onClick={() => handlePaymentClick('Dinheiro')}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Dinheiro
              </Button>
              <Button 
                variant="outline"
                className="col-span-2"
                disabled={cartItems.length === 0} 
                onClick={() => handlePaymentClick('Pix')}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Pix
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Modal de Pagamento */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Pagamento - {paymentMethod}</DialogTitle>
            <DialogDescription>
              Valor total: R$ {total.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {paymentMethod === 'Pix' ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-md">
                  <QrCode size={180} className="text-black" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Escaneie o código QR com o aplicativo do seu banco para realizar o pagamento via Pix
                </p>
              </div>
            ) : paymentMethod === 'Cartão de Crédito' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Número do Cartão</label>
                    <Input placeholder="0000 0000 0000 0000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Validade</label>
                    <Input placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CVV</label>
                    <Input placeholder="000" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Nome no Cartão</label>
                    <Input placeholder="Nome como aparece no cartão" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Valor total:</span>
                  <span className="font-bold">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Valor recebido:</span>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-24 text-right" 
                    defaultValue={total.toFixed(2)}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={processPayment}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Comprovante de Venda */}
      <Sheet open={receiptOpen} onOpenChange={setReceiptOpen}>
        <SheetContent className="min-w-[400px]">
          <SheetHeader>
            <SheetTitle>Comprovante de Venda</SheetTitle>
            <SheetDescription>
              Venda realizada com sucesso!
            </SheetDescription>
          </SheetHeader>
          
          {currentSale && (
            <div className="py-4 space-y-4">
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Venda #{currentSale.id}</p>
                <p className="text-xs text-muted-foreground">
                  {currentSale.date.toLocaleDateString()} - {currentSale.date.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Itens:</p>
                {currentSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </div>
                    <div>R$ {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <div>Total</div>
                  <div>R$ {currentSale.total.toFixed(2)}</div>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <div>Forma de Pagamento</div>
                  <div>{currentSale.paymentMethod}</div>
                </div>
              </div>
            </div>
          )}
          
          <SheetFooter className="flex flex-col gap-2 sm:flex-row mt-6">
            <Button variant="outline" onClick={finishSale}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finalizar
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={sendToWhatsApp}>
              <Share2 className="mr-2 h-4 w-4" />
              Enviar via WhatsApp
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default POS;

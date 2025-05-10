
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
import { Search, Plus, Minus, X, CreditCard, Banknote, ShoppingBag } from "lucide-react";

const POS = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Piercing Labret Titânio', price: 120.00, quantity: 1 },
    { id: 2, name: 'Piercing Septum Aço', price: 85.00, quantity: 1 },
    { id: 3, name: 'Aplicação', price: 50.00, quantity: 1 }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    { id: 1, name: 'Piercing Labret Titânio', category: 'Joias', price: 120.00, stock: 15 },
    { id: 2, name: 'Piercing Septum Aço', category: 'Joias', price: 85.00, stock: 10 },
    { id: 4, name: 'Barbell Industrial Aço', category: 'Joias', price: 95.00, stock: 8 },
    { id: 5, name: 'Captive Ring Titânio', category: 'Joias', price: 110.00, stock: 12 },
    { id: 6, name: 'Kit Cuidados Pós-Piercing', category: 'Cuidados', price: 45.00, stock: 20 },
    { id: 7, name: 'Soro Fisiológico 250ml', category: 'Cuidados', price: 15.00, stock: 30 },
    { id: 8, name: 'Aplicação', category: 'Serviços', price: 50.00, stock: 999 },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
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

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="col-span-2">
        <Tabs defaultValue="all" className="mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="jewelry">Joias</TabsTrigger>
              <TabsTrigger value="care">Cuidados</TabsTrigger>
              <TabsTrigger value="services">Serviços</TabsTrigger>
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
              {filteredProducts
                .filter(product => product.category === 'Joias')
                .map(product => (
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
              {filteredProducts
                .filter(product => product.category === 'Cuidados')
                .map(product => (
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
              {filteredProducts
                .filter(product => product.category === 'Serviços')
                .map(product => (
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
              <Button variant="outline" disabled={cartItems.length === 0}>
                <CreditCard className="mr-2 h-4 w-4" />
                Cartão
              </Button>
              <Button variant="default" disabled={cartItems.length === 0}>
                <Banknote className="mr-2 h-4 w-4" />
                Dinheiro
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default POS;


import React from 'react';
import { 
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Minus, 
  X, 
  CreditCard, 
  Banknote, 
  ShoppingBag,
  QrCode,
} from "lucide-react";
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, change: number) => void;
  onPayment: (method: string) => void;
}

const Cart = ({ cartItems, onRemoveFromCart, onUpdateQuantity, onPayment }: CartProps) => {
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const total = calculateTotal();

  return (
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
                            onClick={() => onUpdateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => onUpdateQuantity(item.id, 1)}
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
                      onClick={() => onRemoveFromCart(item.id)}
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
            onClick={() => onPayment('Cartão de Crédito')}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Cartão
          </Button>
          <Button 
            variant="outline" 
            disabled={cartItems.length === 0}
            onClick={() => onPayment('Dinheiro')}
          >
            <Banknote className="mr-2 h-4 w-4" />
            Dinheiro
          </Button>
          <Button 
            variant="outline"
            className="col-span-2"
            disabled={cartItems.length === 0} 
            onClick={() => onPayment('Pix')}
          >
            <QrCode className="mr-2 h-4 w-4" />
            Pix
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Cart;

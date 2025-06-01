
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, Trash2, CreditCard, Banknote, Gift } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  selectedClient?: any;
  onClientSelect?: (clientId: string) => void;
  clients?: any[];
  appliedDiscount?: { discount: number; reason: string } | null;
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onPayment: (method: string) => void;
}

const Cart = ({ 
  cartItems, 
  selectedClient,
  onClientSelect,
  clients = [],
  appliedDiscount,
  onRemoveFromCart, 
  onUpdateQuantity, 
  onPayment 
}: CartProps) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = appliedDiscount ? subtotal * (appliedDiscount.discount / 100) : 0;
  const total = subtotal - discountAmount;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Carrinho
          {cartItems.length > 0 && (
            <Badge variant="secondary">{cartItems.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção de Cliente */}
        {onClientSelect && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente</label>
            <Select onValueChange={onClientSelect} value={selectedClient?.id || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span>{client.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {client.visits} visitas
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClient && (
              <div className="text-xs text-muted-foreground">
                Cliente: {selectedClient.name} • {selectedClient.visits} visitas
              </div>
            )}
          </div>
        )}

        {cartItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Carrinho vazio
          </p>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            {/* Resumo de valores */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    {appliedDiscount.reason} (-{appliedDiscount.discount}%):
                  </span>
                  <span>-R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botões de pagamento */}
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => onPayment('dinheiro')}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Dinheiro
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onPayment('cartao')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Cartão
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onPayment('pix')}
              >
                PIX
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Cart;

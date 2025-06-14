
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, Trash2, CreditCard, Banknote, Gift, ShoppingCart, User } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Seleção de Cliente */}
      {onClientSelect && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select onValueChange={onClientSelect} value={selectedClient?.id || ''}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-xs text-gray-500">
                        {client.visits} visitas
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClient && (
              <div className="mt-2 p-2 bg-white/70 rounded text-xs text-gray-600 border border-blue-200">
                Cliente: <span className="font-medium">{selectedClient.name}</span> • {selectedClient.visits} visitas
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Itens do Carrinho */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Itens do Carrinho
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Carrinho vazio</p>
              <p className="text-sm">Adicione produtos para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-800">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">
                        R$ {item.price.toFixed(2)}
                      </p>
                      {item.is_service && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                          Serviço
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 hover:border-red-200"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:bg-green-50 hover:border-green-200"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50 hover:border-red-200"
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {cartItems.length > 0 && (
        <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
          <CardContent className="p-4">
            {/* Resumo de valores */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3 w-3" />
                    {appliedDiscount.reason} (-{appliedDiscount.discount}%):
                  </span>
                  <span className="font-medium">-R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-blue-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botões de pagamento */}
            <div className="space-y-2 mt-4">
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
                onClick={() => onPayment('dinheiro')}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Pagar em Dinheiro
              </Button>
              <Button
                variant="outline"
                className="w-full border-blue-200 hover:bg-blue-50 text-blue-700"
                onClick={() => onPayment('cartao')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pagar com Cartão
              </Button>
              <Button
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50 text-purple-700"
                onClick={() => onPayment('pix')}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
                Pagar com PIX
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cart;

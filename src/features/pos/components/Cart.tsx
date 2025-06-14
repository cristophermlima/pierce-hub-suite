
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, Trash2, CreditCard, Banknote, Gift, ShoppingCart, User, Smartphone } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  selectedClient?: any;
  onClientChange?: (client: any) => void;
  clients?: any[];
  appliedDiscount?: { discount: number; reason: string } | null;
  onRemoveFromCart: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCheckout: () => void;
}

const Cart = ({ 
  cartItems, 
  selectedClient,
  onClientChange,
  clients = [],
  appliedDiscount,
  onRemoveFromCart, 
  onUpdateQuantity, 
  onCheckout 
}: CartProps) => {
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = appliedDiscount ? subtotal * (appliedDiscount.discount / 100) : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="space-y-6">
      {/* Seleção de Cliente */}
      {onClientChange && (
        <Card className="bg-gray-50 border-gray-200 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <div className="p-1 bg-gray-600 rounded-md">
                <User className="h-4 w-4 text-white" />
              </div>
              Selecionar Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Select onValueChange={onClientChange} value={selectedClient?.id || ''}>
              <SelectTrigger className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                <SelectValue placeholder="Buscar cliente..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-xs text-gray-500">
                        {client.visits} visitas realizadas
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClient && (
              <div className="mt-3 p-3 bg-white rounded-lg text-xs text-gray-600 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-500 rounded-full">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">{selectedClient.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedClient.visits} visitas
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Itens do Carrinho */}
      <Card className="border-gray-200 shadow-md bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-gray-700 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            Carrinho
            {cartItems.length > 0 && (
              <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                {cartItems.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="h-10 w-10 text-gray-300" />
              </div>
              <p className="font-medium text-lg mb-2">Carrinho vazio</p>
              <p className="text-sm">Adicione produtos para começar a venda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="group flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg font-bold text-green-600">
                        R$ {item.price.toFixed(2)}
                      </p>
                      {item.is_service && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                          Serviço
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-bold bg-gray-50 rounded px-2 py-1">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onRemoveFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {cartItems.length > 0 && (
        <Card className="border-gray-200 bg-gray-50 shadow-lg">
          <CardContent className="p-6">
            {/* Resumo de valores */}
            <div className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-gray-600 font-medium">Subtotal:</span>
                <span className="font-bold text-gray-800">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-base text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                  <span className="flex items-center gap-2 font-medium">
                    <Gift className="h-4 w-4" />
                    {appliedDiscount.reason} (-{appliedDiscount.discount}%):
                  </span>
                  <span className="font-bold">-R$ {discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-xl pt-4 border-t-2 border-gray-200">
                <span className="text-gray-800">Total:</span>
                <span className="text-2xl text-green-600">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Botões de pagamento */}
            <div className="space-y-3 mt-6">
              <Button
                className="w-full h-14 bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 font-bold text-base"
                onClick={onCheckout}
              >
                <Banknote className="mr-3 h-5 w-5" />
                Dinheiro
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-800 font-bold text-base shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                onClick={onCheckout}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Cartão
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Cart;

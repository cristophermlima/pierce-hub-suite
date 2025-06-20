
import { useState } from 'react';
import { CartItem } from '../types';
import { toast } from 'sonner';

export function useCartState() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    console.log('Adding to cart:', item);
    
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Se já existe no carrinho, aumenta a quantidade
      if (!item.is_service && existingItem.quantity >= item.stock) {
        toast.error('Quantidade indisponível em estoque');
        return;
      }
      
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      // Se não existe, adiciona novo item
      if (!item.is_service && item.stock <= 0) {
        toast.error('Produto fora de estoque');
        return;
      }
      
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cartItems.find(cartItem => cartItem.id === productId);
    if (item && !item.is_service && quantity > item.stock) {
      toast.error('Quantidade indisponível em estoque');
      return;
    }

    setCartItems(cartItems.map(cartItem =>
      cartItem.id === productId
        ? { ...cartItem, quantity }
        : cartItem
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}

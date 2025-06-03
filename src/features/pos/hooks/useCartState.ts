
import { useState } from 'react';
import { CartItem } from '../types';
import { toast } from 'sonner';

export function useCartState() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.error('Quantidade indisponível em estoque');
      }
    } else {
      if (product.stock > 0) {
        setCartItems([...cartItems, { 
          ...product, 
          quantity: 1,
          originalId: product.originalId || product.id 
        }]);
      } else {
        toast.error('Produto fora de estoque');
      }
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number, localProducts: any[]) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = localProducts.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast.error('Quantidade indisponível em estoque');
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
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

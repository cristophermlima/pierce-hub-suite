
import { useState } from 'react';
import { CartItem, Product } from '../types';
import { products } from '../data/products';
import { useToast } from "@/components/ui/use-toast";

export const usePOSState = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [localProducts, setLocalProducts] = useState<Product[]>([...products]);

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

  const clearCart = () => {
    setCartItems([]);
  };

  const updateProductStock = (cartItems: CartItem[]) => {
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
  };

  return {
    cartItems,
    searchQuery,
    setSearchQuery,
    selectedTab,
    setSelectedTab,
    localProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    clearCart,
    updateProductStock,
  };
};


import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartItem } from '../types';
import { useLoyalty } from '@/features/loyalty/hooks/useLoyalty';
import { toast } from 'sonner';

interface InventoryProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string;
  is_service: boolean;
  brand?: string;
  category?: { name: string; type: string };
}

interface POSClient {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  visits: number;
  birthDate: string | null;
}

export function usePOSState() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedClient, setSelectedClient] = useState<POSClient | null>(null);
  const queryClient = useQueryClient();
  const { getClientDiscount, updateClientVisits } = useLoyalty();

  // Buscar produtos do estoque
  const { data: inventoryProducts = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['inventory-products'],
    queryFn: async (): Promise<InventoryProduct[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('inventory')
        .select(`
          id,
          name,
          price,
          stock,
          category_id,
          is_service,
          brand,
          product_categories (
            name,
            type
          )
        `)
        .eq('user_id', user.id)
        .gt('stock', 0); // Apenas produtos em estoque

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        category_id: item.category_id || '',
        is_service: item.is_service || false,
        brand: item.brand || undefined,
        category: item.product_categories ? {
          name: item.product_categories.name,
          type: item.product_categories.type || 'general'
        } : undefined
      }));
    },
  });

  // Buscar clientes para seleção no PDV
  const { data: clients = [] } = useQuery({
    queryKey: ['pos-clients'],
    queryFn: async (): Promise<POSClient[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, phone, visits, birth_date')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      return data.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        visits: client.visits || 0,
        birthDate: client.birth_date
      }));
    },
  });

  // Converter produtos do estoque para formato do POS
  const localProducts = inventoryProducts.map(product => ({
    id: parseInt(product.id.replace(/-/g, '').substring(0, 8), 16), // Converter UUID para número
    name: product.name,
    category: getCategoryMapping(product.category?.type || 'general'),
    price: product.price,
    stock: product.stock,
    originalId: product.id // Manter ID original para atualizações
  }));

  // Filtrar produtos baseado na pesquisa e categoria
  const filteredProducts = localProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedTab === 'all' || product.category === selectedTab;
    return matchesSearch && matchesCategory;
  });

  // Atualizar estoque após venda
  const updateStockMutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      for (const item of items) {
        const originalProduct = inventoryProducts.find(p => p.id === item.originalId);
        if (originalProduct && !originalProduct.is_service) {
          const { error } = await supabase
            .from('inventory')
            .update({ stock: originalProduct.stock - item.quantity })
            .eq('id', item.originalId)
            .eq('user_id', user.id);

          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
      toast.success('Estoque atualizado com sucesso');
    }
  });

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

  const updateQuantity = (productId: number, quantity: number) => {
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

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Aplicar desconto de fidelidade se cliente selecionado
    if (selectedClient) {
      const loyaltyClient = {
        id: selectedClient.id,
        name: selectedClient.name,
        email: selectedClient.email,
        phone: selectedClient.phone,
        visits: selectedClient.visits,
        lastVisit: null,
        birthDate: selectedClient.birthDate,
        loyaltyLevel: 'regular' as const,
        nextReward: '',
        discountEligible: false
      };
      
      const discount = getClientDiscount(loyaltyClient);
      if (discount) {
        const discountAmount = subtotal * (discount.discount / 100);
        return subtotal - discountAmount;
      }
    }
    
    return subtotal;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateProductStock = (items: CartItem[]) => {
    updateStockMutation.mutate(items);
  };

  const getAppliedDiscount = () => {
    if (!selectedClient) return null;
    
    const loyaltyClient = {
      id: selectedClient.id,
      name: selectedClient.name,
      email: selectedClient.email,
      phone: selectedClient.phone,
      visits: selectedClient.visits,
      lastVisit: null,
      birthDate: selectedClient.birthDate,
      loyaltyLevel: 'regular' as const,
      nextReward: '',
      discountEligible: false
    };
    
    return getClientDiscount(loyaltyClient);
  };

  return {
    cartItems,
    searchQuery,
    setSearchQuery,
    selectedTab,
    setSelectedTab,
    selectedClient,
    setSelectedClient,
    localProducts: filteredProducts,
    clients,
    isLoadingProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateTotal,
    clearCart,
    updateProductStock,
    getAppliedDiscount,
    updateClientVisits
  };
}

// Mapear tipos de categoria do banco para categorias do POS
function getCategoryMapping(type: string): string {
  switch (type) {
    case 'jewelry': return 'jewelry';
    case 'material': return 'care';
    default: return 'accessories';
  }
}

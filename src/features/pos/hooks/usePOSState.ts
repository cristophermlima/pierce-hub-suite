import { useState } from 'react';
import { useLoyalty } from '@/features/loyalty/hooks/useLoyalty';
import { useProductsQuery } from './useProductsQuery';
import { useClientsQuery } from './useClientsQuery';
import { useCartState } from './useCartState';
import { useStockUpdates } from './useStockUpdates';

interface POSClient {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  visits: number;
  birthDate: string | null;
}

export function usePOSState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedClient, setSelectedClient] = useState<POSClient | null>(null);
  const { getClientDiscount, updateClientVisits } = useLoyalty();

  // Queries
  const { data: inventoryProducts = [], isLoading: isLoadingProducts } = useProductsQuery();
  const { data: clients = [] } = useClientsQuery();

  // Cart state
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCartState();

  // Stock updates
  const { updateProductStock } = useStockUpdates(inventoryProducts);

  // Converter produtos do estoque para formato do POS
  const localProducts = inventoryProducts.map(product => ({
    id: parseInt(product.id.replace(/-/g, '').substring(0, 8), 16), // Converter UUID para número
    name: product.name,
    category: getCategoryMapping(product.category?.type || 'general'),
    price: product.price,
    stock: product.stock,
    originalId: product.id, // Manter ID original para atualizações
    is_service: product.is_service
  }));

  // Filtrar produtos baseado na pesquisa e categoria
  const filteredProducts = localProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedTab !== 'all') {
      switch (selectedTab) {
        case 'jewelry':
          matchesCategory = product.category === 'jewelry';
          break;
        case 'care':
          matchesCategory = product.category === 'care';
          break;
        case 'services':
          matchesCategory = product.is_service;
          break;
        case 'accessories':
          matchesCategory = product.category === 'accessories';
          break;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

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

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity, localProducts);
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
    updateQuantity: handleUpdateQuantity,
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
    case 'service': return 'services';
    default: return 'accessories';
  }
}

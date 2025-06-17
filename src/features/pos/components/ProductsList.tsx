
import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductsHeader } from './ProductsHeader';
import { useProductsQuery } from '../hooks/useProductsQuery';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string;
  is_service: boolean;
  brand?: string;
  category?: { name: string; type: string } | null;
}

interface ProductsListProps {
  onAddToCart: (product: Product) => void;
}

export function ProductsList({ onAddToCart }: ProductsListProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: products = [], isLoading } = useProductsQuery();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryType = product.category?.type || 'general';
    const matchesTab = selectedTab === 'all' || categoryType === selectedTab;
    return matchesSearch && matchesTab;
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ProductsHeader
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 overflow-auto p-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhum produto encontrado para esta busca.' : 'Nenhum produto disponível.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

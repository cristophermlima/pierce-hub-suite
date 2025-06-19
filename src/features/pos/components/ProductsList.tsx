
import React from 'react';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { ProductCard } from './ProductCard';
import ProductsHeader from './ProductsHeader';
import { CartItem } from '../types';

interface ProductsListProps {
  onAddToCart: (item: CartItem) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ onAddToCart }) => {
  const { data: products = [], isLoading, error } = useProductsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar produtos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductsHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;

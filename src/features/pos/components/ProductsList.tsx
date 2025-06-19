
import React from 'react';
import { useProductsQuery } from '../hooks/useProductsQuery';
import { ProductCard } from './ProductCard';
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

  const handleAddToCart = (product: any) => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`, // Unique ID for cart
      originalId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      category_id: product.category_id,
      is_service: product.is_service
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;

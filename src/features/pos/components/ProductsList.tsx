
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductsListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  selectedTab: string;
  searchQuery: string;
}

const ProductsList = ({ products, onAddToCart, selectedTab, searchQuery }: ProductsListProps) => {
  const filteredProducts = products.filter(product => {
    // Safe access to category with proper null checking
    const categoryName = product.category && typeof product.category === 'object' && product.category !== null && 'name' in product.category
      ? (product.category as any).name 
      : (typeof product.category === 'string' ? product.category : 'Sem categoria');
      
    if (selectedTab !== 'all') {
      if (selectedTab === 'jewelry' && categoryName !== 'Joias') return false;
      if (selectedTab === 'care' && categoryName !== 'Cuidados') return false;
      if (selectedTab === 'services' && categoryName !== 'Serviços') return false;
      if (selectedTab === 'accessories' && categoryName !== 'Acessórios') return false;
    }
    
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           categoryName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductsList;

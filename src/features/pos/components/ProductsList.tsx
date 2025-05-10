
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
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
    if (selectedTab !== 'all' && 
        selectedTab === 'jewelry' && product.category !== 'Joias' ||
        selectedTab === 'care' && product.category !== 'Cuidados' ||
        selectedTab === 'services' && product.category !== 'Serviços' ||
        selectedTab === 'accessories' && product.category !== 'Acessórios') {
      return false;
    }
    
    return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           product.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <TabsContent value="all" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="jewelry" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="care" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="services" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="accessories" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </TabsContent>
    </>
  );
};

export default ProductsList;

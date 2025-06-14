
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Safe access to category with proper null checking
  const categoryName = product.category && typeof product.category === 'object' && product.category !== null && 'name' in product.category
    ? (product.category as any).name 
    : (typeof product.category === 'string' ? product.category : 'Sem categoria');

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gray-100 rounded-lg">
                <Package className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 truncate">{product.name}</h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge 
                variant="outline" 
                className="text-xs bg-gray-50 text-gray-700 border-gray-200"
              >
                {categoryName}
              </Badge>
              
              {product.is_service && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  Serviço
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                {!product.is_service && (
                  <span className="text-sm text-gray-500">
                    Estoque: {product.stock}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onAddToCart(product)}
          className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 font-bold"
          disabled={!product.is_service && product.stock <= 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          {!product.is_service && product.stock <= 0 ? 'Sem Estoque' : 'Adicionar'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

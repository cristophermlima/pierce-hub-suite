
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package2, Wrench } from "lucide-react";
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const isLowStock = product.stock !== undefined && product.stock < 5;
  const isOutOfStock = product.stock !== undefined && product.stock === 0;
  
  // Safe access to category with proper null checking
  const categoryName = product.category && typeof product.category === 'object' && product.category !== null && 'name' in product.category
    ? product.category.name 
    : (typeof product.category === 'string' ? product.category : 'Sem categoria');
  
  return (
    <Card className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-shrink-0">
            {product.is_service ? (
              <div className="p-2 bg-blue-50 rounded-lg">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
            ) : (
              <div className="p-2 bg-gray-50 rounded-lg">
                <Package2 className="h-5 w-5 text-gray-600" />
              </div>
            )}
          </div>
          
          {product.stock !== undefined && !product.is_service && (
            <Badge 
              variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "outline"}
              className="text-xs px-2 py-1"
            >
              {product.stock} unid.
            </Badge>
          )}
        </div>

        <CardTitle className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </CardTitle>
        
        <CardDescription className="text-sm text-gray-500 mb-3">
          {categoryName}
        </CardDescription>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-green-600">
            R$ {product.price.toFixed(2)}
          </div>
          
          <Button 
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            size="sm"
            className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> 
            {isOutOfStock ? 'Indisponível' : 'Adicionar'}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProductCard;


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
  const categoryName = product.category && typeof product.category === 'object' && product.category !== null
    ? product.category.name 
    : (typeof product.category === 'string' ? product.category : 'Sem categoria');
  
  return (
    <Card className="h-24 flex items-center p-4 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="flex-shrink-0 mr-3">
        {product.is_service ? (
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wrench className="h-5 w-5 text-blue-600" />
          </div>
        ) : (
          <div className="p-2 bg-gray-100 rounded-lg">
            <Package2 className="h-5 w-5 text-gray-600" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <CardHeader className="p-0">
          <CardTitle className="text-sm font-semibold text-gray-900 truncate">
            {product.name}
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            {categoryName}
          </CardDescription>
        </CardHeader>
        
        <div className="text-lg font-bold text-green-600 mt-1">
          R$ {product.price.toFixed(2)}
        </div>
      </div>

      {/* Stock and Button */}
      <div className="flex flex-col items-end gap-2 ml-3">
        {product.stock !== undefined && !product.is_service && (
          <Badge 
            variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "outline"}
            className="text-xs"
          >
            {product.stock} unid.
          </Badge>
        )}
        
        <Button 
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          size="sm"
          className="h-8 px-3"
        >
          <Plus className="h-3 w-3 mr-1" /> 
          {isOutOfStock ? 'Indisponível' : 'Adicionar'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;

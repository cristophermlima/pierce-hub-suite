
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
  
  // Safe access to category
  const categoryName = product.category && typeof product.category === 'object' 
    ? product.category.name 
    : (product.category || 'Sem categoria');
  
  return (
    <Card className="group overflow-hidden border border-neutral-700 bg-neutral-900 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-row items-center p-4 h-24">
      {/* Left side - Icon and Badge */}
      <div className="flex flex-col items-center gap-1 mr-3">
        {product.is_service ? (
          <div className="p-1.5 bg-neutral-700 rounded-md">
            <Wrench className="h-3 w-3 text-white" />
          </div>
        ) : (
          <div className="p-1.5 bg-neutral-700 rounded-md">
            <Package2 className="h-3 w-3 text-white" />
          </div>
        )}
        <Badge 
          variant="outline"
          className="text-xs bg-neutral-800 text-neutral-300 border-neutral-600 px-1 py-0"
        >
          {product.is_service ? 'Serviço' : 'Produto'}
        </Badge>
      </div>

      {/* Center - Product Info */}
      <div className="flex-1 min-w-0">
        <CardHeader className="p-0">
          <CardTitle className="text-sm font-bold text-white leading-tight line-clamp-1 mb-1">
            {product.name}
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            {categoryName}
          </CardDescription>
        </CardHeader>
        
        <div className="text-sm font-bold text-green-400 mb-1">
          R$ {product.price.toFixed(2)}
        </div>
        
        {product.stock !== undefined && !product.is_service && (
          <div className="text-xs text-neutral-400">
            Estoque: <span className={`font-medium ${
              isOutOfStock ? 'text-red-400' : 
              isLowStock ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {product.stock} unid
            </span>
          </div>
        )}
      </div>

      {/* Right side - Stock badge and button */}
      <div className="flex flex-col items-end gap-1 ml-3">
        {product.stock !== undefined && (
          <Badge 
            variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "outline"}
            className={`text-xs ${
              isOutOfStock 
                ? "bg-red-900 text-red-300 border-red-700" 
                : isLowStock 
                  ? "bg-yellow-900 text-yellow-300 border-yellow-700"
                  : "bg-green-900 text-green-300 border-green-700"
            }`}
          >
            {isOutOfStock ? 'Sem estoque' : `${product.stock} unid.`}
          </Badge>
        )}
        
        <Button 
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          size="sm"
          className={`font-medium text-xs transition-all duration-200 h-7 px-2 ${
            isOutOfStock 
              ? "bg-neutral-700 text-neutral-500 cursor-not-allowed hover:bg-neutral-700" 
              : "bg-white hover:bg-neutral-200 text-black"
          }`}
        >
          <Plus className="h-3 w-3 mr-1" /> 
          {isOutOfStock ? 'Indisponível' : 'Adicionar'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;


import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
  
  return (
    <Card className="group overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {product.is_service ? (
              <div className="p-1.5 bg-gray-600 rounded-md">
                <Wrench className="h-3 w-3 text-white" />
              </div>
            ) : (
              <div className="p-1.5 bg-gray-600 rounded-md">
                <Package2 className="h-3 w-3 text-white" />
              </div>
            )}
            <Badge 
              variant="outline"
              className="text-xs bg-gray-50 text-gray-600 border-gray-200"
            >
              {product.is_service ? 'Serviço' : 'Produto'}
            </Badge>
          </div>
          {product.stock !== undefined && (
            <Badge 
              variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "outline"}
              className={`text-xs ${
                isOutOfStock 
                  ? "bg-red-50 text-red-600 border-red-200" 
                  : isLowStock 
                    ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                    : "bg-green-50 text-green-600 border-green-200"
              }`}
            >
              {isOutOfStock ? 'Sem estoque' : `${product.stock} unid.`}
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1">
          {product.name}
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          {product.category}
        </CardDescription>
      </CardHeader>

      {/* Body - Price */}
      <div className="flex-1 px-6 pb-2">
        <div className="text-2xl font-bold text-green-600 mb-1">
          R$ {product.price.toFixed(2)}
        </div>
        
        {product.stock !== undefined && !product.is_service && (
          <div className="text-xs text-gray-500">
            Estoque disponível: <span className={`font-medium ${
              isOutOfStock ? 'text-red-600' : 
              isLowStock ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {product.stock} unid
            </span>
          </div>
        )}
      </div>

      {/* Footer - Button */}
      <CardFooter className="pt-0 pb-4">
        <Button 
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          size="sm"
          className={`w-full font-medium text-xs transition-all duration-200 ${
            isOutOfStock 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300" 
              : "bg-gray-900 hover:bg-gray-800 text-white"
          }`}
        >
          <Plus className="h-3 w-3 mr-1" /> 
          {isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

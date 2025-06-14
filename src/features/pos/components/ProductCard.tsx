
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
    <Card className="overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            {product.is_service ? (
              <div className="p-1 bg-purple-100 rounded">
                <Wrench className="h-3 w-3 text-purple-600" />
              </div>
            ) : (
              <div className="p-1 bg-blue-100 rounded">
                <Package2 className="h-3 w-3 text-blue-600" />
              </div>
            )}
            <Badge 
              variant={product.is_service ? "secondary" : "outline"}
              className={product.is_service ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}
            >
              {product.is_service ? 'Serviço' : 'Produto'}
            </Badge>
          </div>
          {product.stock !== undefined && (
            <Badge 
              variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "outline"}
              className="text-xs"
            >
              {isOutOfStock ? 'Sem estoque' : `${product.stock} unid.`}
            </Badge>
          )}
        </div>
        <CardTitle className="text-base font-semibold text-gray-800 leading-tight">
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {product.category}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between p-4 pt-2 bg-gray-50/50">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">
            R$ {product.price.toFixed(2)}
          </span>
          {product.stock !== undefined && !product.is_service && (
            <span className="text-xs text-gray-500">
              Estoque: {product.stock}
            </span>
          )}
        </div>
        <Button 
          size="sm" 
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
        >
          <Plus className="h-4 w-4 mr-1" /> 
          {isOutOfStock ? 'Indisponível' : 'Adicionar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;


import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package2, Wrench, Star } from "lucide-react";
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const isLowStock = product.stock !== undefined && product.stock < 5;
  const isOutOfStock = product.stock !== undefined && product.stock === 0;
  
  return (
    <Card className="group overflow-hidden border-0 bg-white/90 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
      {/* Header com gradiente */}
      <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {product.is_service ? (
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md">
                <Wrench className="h-4 w-4 text-white" />
              </div>
            ) : (
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-md">
                <Package2 className="h-4 w-4 text-white" />
              </div>
            )}
            <Badge 
              variant={product.is_service ? "secondary" : "outline"}
              className={`text-xs font-medium ${
                product.is_service 
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200" 
                  : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200"
              }`}
            >
              {product.is_service ? 'Serviço' : 'Produto'}
            </Badge>
          </div>
          {product.stock !== undefined && (
            <Badge 
              variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "outline"}
              className={`text-xs font-medium ${
                isOutOfStock 
                  ? "bg-red-100 text-red-700 border-red-200" 
                  : isLowStock 
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                    : "bg-green-100 text-green-700 border-green-200"
              }`}
            >
              {isOutOfStock ? 'Sem estoque' : `${product.stock} unid.`}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <CardTitle className="text-base lg:text-lg font-bold text-gray-800 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 line-clamp-1">
            {product.category}
          </CardDescription>
        </div>
      </div>

      {/* Body expandido */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Informações do produto */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              R$ {product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">4.8</span>
            </div>
          </div>
          
          {product.stock !== undefined && !product.is_service && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estoque disponível:</span>
              <span className={`font-medium ${
                isOutOfStock ? 'text-red-600' : 
                isLowStock ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {product.stock} unidades
              </span>
            </div>
          )}
        </div>

        {/* Botão de ação */}
        <Button 
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full h-12 font-semibold text-sm lg:text-base transition-all duration-300 ${
            isOutOfStock 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
          }`}
        >
          <Plus className="h-4 w-4 mr-2" /> 
          {isOutOfStock ? 'Indisponível' : 'Adicionar ao Carrinho'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;

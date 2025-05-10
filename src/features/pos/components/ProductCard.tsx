
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden border border-border">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{product.name}</CardTitle>
        <CardDescription>
          {product.category} {product.stock !== undefined && `· Estoque: ${product.stock}`}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-xl font-bold">R$ {product.price.toFixed(2)}</span>
        <Button size="sm" onClick={() => onAddToCart(product)}>
          <Plus className="h-4 w-4 mr-2" /> Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

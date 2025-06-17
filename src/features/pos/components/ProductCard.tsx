
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_id: string;
  is_service: boolean;
  brand?: string;
  category?: { name: string; type: string } | null;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isLowStock = product.stock < 5 && !product.is_service;
  const categoryName = product.category?.name || 'Sem categoria';

  return (
    <Card className="h-full">
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
            {product.is_service ? (
              <Badge variant="secondary" className="text-xs">Serviço</Badge>
            ) : isLowStock ? (
              <Badge variant="destructive" className="text-xs">Baixo</Badge>
            ) : (
              <Badge variant="default" className="text-xs">Estoque</Badge>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground mb-1">{categoryName}</p>
          {product.brand && (
            <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
          )}
          
          <div className="space-y-1 mb-3">
            <p className="font-bold text-lg">R$ {product.price.toFixed(2)}</p>
            {!product.is_service && (
              <p className="text-xs text-muted-foreground">
                Estoque: {product.stock}
              </p>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full mt-auto"
          size="sm"
          disabled={!product.is_service && product.stock <= 0}
        >
          <Plus size={16} className="mr-1" />
          Adicionar
        </Button>
      </CardContent>
    </Card>
  );
}

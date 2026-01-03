
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PublicCatalog = () => {
  const { token } = useParams<{ token: string }>();

  const { data: catalog, isLoading: catalogLoading } = useQuery({
    queryKey: ['public-catalog', token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catalogs')
        .select('*')
        .eq('share_token', token)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['public-catalog-items', catalog?.id],
    queryFn: async () => {
      if (!catalog?.id) return [];

      const { data, error } = await supabase
        .from('catalog_items')
        .select(`
          *,
          inventory:inventory_id (
            id,
            name,
            price,
            images,
            category:category_id (name)
          )
        `)
        .eq('catalog_id', catalog.id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!catalog?.id,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (catalogLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Catálogo não encontrado</h1>
          <p className="text-muted-foreground">
            Este catálogo pode não existir ou estar desativado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">{catalog.name}</h1>
          {catalog.description && (
            <p className="mt-2 opacity-90">{catalog.description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {itemsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Este catálogo ainda não possui itens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.inventory?.images?.[0] ? (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.inventory.images[0]}
                      alt={item.custom_name || item.inventory?.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Sem imagem</span>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2">
                    {item.custom_name || item.inventory?.name}
                  </h3>
                  {item.inventory?.category?.name && (
                    <Badge variant="secondary" className="mt-2">
                      {item.inventory.category.name}
                    </Badge>
                  )}
                  <p className="text-xl font-bold text-primary mt-3">
                    {formatCurrency(item.custom_price || item.inventory?.price || 0)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Catálogo criado com PiercerHub</p>
      </div>
    </div>
  );
};

export default PublicCatalog;

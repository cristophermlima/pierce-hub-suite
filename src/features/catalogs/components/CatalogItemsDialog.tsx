
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, ExternalLink, Copy, Check } from 'lucide-react';
import { Catalog, CatalogItem, useCatalogItems } from '../hooks/useCatalogs';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CatalogItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: Catalog | null;
}

export function CatalogItemsDialog({ open, onOpenChange, catalog }: CatalogItemsDialogProps) {
  const { formatCurrency } = useAppSettings();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const { items, isLoading, addItem, removeItem, isAdding } = useCatalogItems(catalog?.id || null);

  // Buscar itens do inventário para adicionar
  const { data: inventoryItems = [] } = useQuery({
    queryKey: ['inventory-for-catalog'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('inventory')
        .select('id, name, price, images, category:category_id (name)')
        .eq('user_id', user.id)
        .eq('is_service', false)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const shareUrl = catalog ? `${window.location.origin}/catalog/${catalog.share_token}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copiado!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddItem = () => {
    if (!catalog || !selectedInventoryId) return;
    
    addItem({
      catalog_id: catalog.id,
      inventory_id: selectedInventoryId,
      custom_name: customName || undefined,
      custom_price: customPrice ? parseFloat(customPrice) : undefined,
    });
    
    setSelectedInventoryId('');
    setCustomName('');
    setCustomPrice('');
  };

  // Filtrar itens que já estão no catálogo
  const availableItems = inventoryItems.filter(
    (inv) => !items.some((item) => item.inventory_id === inv.id)
  );

  if (!catalog) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {catalog.name}
            {catalog.is_active ? (
              <Badge variant="default">Ativo</Badge>
            ) : (
              <Badge variant="secondary">Inativo</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link de compartilhamento */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm text-muted-foreground">Link de Compartilhamento</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input value={shareUrl} readOnly className="text-xs" />
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          </div>

          {/* Adicionar item */}
          <div className="p-4 border rounded-lg space-y-3">
            <Label className="font-medium">Adicionar Item ao Catálogo</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedInventoryId}
                onChange={(e) => setSelectedInventoryId(e.target.value)}
              >
                <option value="">Selecione um produto</option>
                {availableItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {formatCurrency(item.price)}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Nome personalizado (opcional)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Preço personalizado"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddItem}
              disabled={!selectedInventoryId || isAdding}
              size="sm"
            >
              <Plus size={16} className="mr-1" />
              Adicionar
            </Button>
          </div>

          {/* Lista de itens */}
          <div>
            <Label className="font-medium">Itens do Catálogo ({items.length})</Label>
            <ScrollArea className="h-[300px] mt-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum item no catálogo. Adicione itens do seu inventário.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.inventory?.images?.[0] && (
                          <img
                            src={item.inventory.images[0]}
                            alt={item.custom_name || item.inventory?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {item.custom_name || item.inventory?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.inventory?.category?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">
                          {formatCurrency(item.custom_price || item.inventory?.price || 0)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

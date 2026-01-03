
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Catalog {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  share_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: string;
  catalog_id: string;
  inventory_id: string;
  custom_name: string | null;
  custom_price: number | null;
  display_order: number;
  created_at: string;
  inventory?: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    category?: { name: string } | null;
  };
}

export function useCatalogs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: catalogs = [], isLoading } = useQuery({
    queryKey: ['catalogs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('catalogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Catalog[];
    },
  });

  const createCatalog = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: catalog, error } = await supabase
        .from('catalogs')
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description || null,
        })
        .select()
        .single();

      if (error) throw error;
      return catalog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
      toast({ title: "Catálogo criado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar catálogo", variant: "destructive" });
    },
  });

  const updateCatalog = useMutation({
    mutationFn: async (data: { id: string; name: string; description?: string; is_active?: boolean }) => {
      const { error } = await supabase
        .from('catalogs')
        .update({
          name: data.name,
          description: data.description || null,
          is_active: data.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
      toast({ title: "Catálogo atualizado!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar catálogo", variant: "destructive" });
    },
  });

  const deleteCatalog = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('catalogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
      toast({ title: "Catálogo excluído!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir catálogo", variant: "destructive" });
    },
  });

  return {
    catalogs,
    isLoading,
    createCatalog: createCatalog.mutate,
    updateCatalog: updateCatalog.mutate,
    deleteCatalog: deleteCatalog.mutate,
    isCreating: createCatalog.isPending,
    isUpdating: updateCatalog.isPending,
  };
}

export function useCatalogItems(catalogId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['catalog-items', catalogId],
    queryFn: async () => {
      if (!catalogId) return [];

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
        .eq('catalog_id', catalogId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as CatalogItem[];
    },
    enabled: !!catalogId,
  });

  const addItem = useMutation({
    mutationFn: async (data: { catalog_id: string; inventory_id: string; custom_name?: string; custom_price?: number }) => {
      const { error } = await supabase
        .from('catalog_items')
        .insert({
          catalog_id: data.catalog_id,
          inventory_id: data.inventory_id,
          custom_name: data.custom_name || null,
          custom_price: data.custom_price || null,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-items', catalogId] });
      toast({ title: "Item adicionado ao catálogo!" });
    },
    onError: () => {
      toast({ title: "Erro ao adicionar item", variant: "destructive" });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('catalog_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-items', catalogId] });
      toast({ title: "Item removido do catálogo!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover item", variant: "destructive" });
    },
  });

  const updateItem = useMutation({
    mutationFn: async (data: { id: string; custom_name?: string; custom_price?: number }) => {
      const { error } = await supabase
        .from('catalog_items')
        .update({
          custom_name: data.custom_name || null,
          custom_price: data.custom_price || null,
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-items', catalogId] });
      toast({ title: "Item atualizado!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar item", variant: "destructive" });
    },
  });

  return {
    items,
    isLoading,
    addItem: addItem.mutate,
    removeItem: removeItem.mutate,
    updateItem: updateItem.mutate,
    isAdding: addItem.isPending,
  };
}


import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InventoryItem, Category, InventoryMutationData, InventoryItemInsert, InventoryItemUpdate } from '../types';

export function useInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const queryClient = useQueryClient();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast.error('Não foi possível carregar as categorias');
      }
    };

    fetchCategories();
  }, []);

  // Fetch inventory items
  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product_categories (
            id,
            name
          )
        `)
        .order('name');

      if (error) {
        toast.error('Erro ao carregar inventário');
        throw error;
      }
      
      return data.map((item: any) => ({
        ...item,
        category_name: item.product_categories?.name || 'Sem categoria'
      }));
    }
  });

  // Add/Edit inventory item
  const inventoryMutation = useMutation({
    mutationFn: async (item: InventoryMutationData) => {
      let result;
      
      if (selectedItem) {
        // Edit existing item
        const updateData: InventoryItemUpdate = {
          name: item.name,
          category_id: item.category_id,
          price: item.price,
          stock: item.stock,
          threshold: item.threshold,
          is_service: item.is_service
        };
        
        const { data, error } = await supabase
          .from('inventory')
          .update(updateData)
          .eq('id', selectedItem.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Add new item
        const insertData: InventoryItemInsert = {
          name: item.name,
          category_id: item.category_id,
          price: item.price,
          stock: item.stock,
          threshold: item.threshold,
          is_service: item.is_service
        };
        
        const { data, error } = await supabase
          .from('inventory')
          .insert(insertData)
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success(selectedItem ? 'Item atualizado com sucesso' : 'Item adicionado com sucesso');
      setIsDialogOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      console.error('Erro na operação:', error);
      toast.error(`Falha ao ${selectedItem ? 'atualizar' : 'adicionar'} item: ${error.message}`);
    }
  });

  // Filter inventory items
  const filteredInventory = inventoryItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveItem = (formData: InventoryMutationData) => {
    inventoryMutation.mutate(formData);
  };

  return {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    isDialogOpen,
    setIsDialogOpen,
    selectedItem,
    setSelectedItem,
    categories,
    inventoryItems,
    filteredInventory,
    isLoading,
    inventoryMutation,
    handleAddItem,
    handleEditItem,
    handleSaveItem
  };
}

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  InventoryItem, 
  Category, 
  JewelryMaterial, 
  ThreadType, 
  Supplier,
  InventoryMutationData, 
  InventoryItemInsert, 
  InventoryItemUpdate 
} from '../types';

export function useInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [jewelryMaterials, setJewelryMaterials] = useState<JewelryMaterial[]>([]);
  const [threadTypes, setThreadTypes] = useState<ThreadType[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const queryClient = useQueryClient();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*')
          .order('type, name');
        
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

  // Fetch jewelry materials
  useEffect(() => {
    const fetchJewelryMaterials = async () => {
      try {
        const { data, error } = await supabase
          .from('jewelry_materials')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setJewelryMaterials(data);
        }
      } catch (error) {
        console.error('Erro ao buscar materiais:', error);
        toast.error('Não foi possível carregar os materiais');
      }
    };

    fetchJewelryMaterials();
  }, []);

  // Fetch thread types
  useEffect(() => {
    const fetchThreadTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('thread_types')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setThreadTypes(data);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de rosca:', error);
        toast.error('Não foi possível carregar os tipos de rosca');
      }
    };

    fetchThreadTypes();
  }, []);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('suppliers')
          .select('id, name')
          .eq('user_id', user.id)
          .order('name');
        
        if (error) throw error;
        
        if (data) {
          setSuppliers(data);
        }
      } catch (error) {
        console.error('Erro ao buscar fornecedores:', error);
        toast.error('Não foi possível carregar os fornecedores');
      }
    };

    fetchSuppliers();
  }, []);

  // Fetch inventory items
  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product_categories (
            id,
            name,
            type
          ),
          jewelry_materials (
            id,
            name
          ),
          thread_types (
            id,
            name
          ),
          suppliers (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        toast.error('Erro ao carregar estoque');
        throw error;
      }
      
      return data.map((item: any) => ({
        ...item,
        category_name: item.product_categories?.name || 'Sem categoria',
        jewelry_material_name: item.jewelry_materials?.name || null,
        thread_type_name: item.thread_types?.name || null,
        supplier_name: item.suppliers?.name || null
      }));
    }
  });

  // Add/Edit inventory item
  const inventoryMutation = useMutation({
    mutationFn: async (item: InventoryMutationData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Limpar valores undefined/null para campos opcionais
      const cleanedItem = {
        name: item.name,
        category_id: item.category_id || null,
        price: Number(item.price) || 0,
        stock: Number(item.stock) || 0,
        threshold: Number(item.threshold) || 5,
        is_service: Boolean(item.is_service),
        sku: item.sku || null,
        brand: item.brand || null,
        supplier_id: item.supplier_id || null,
        jewelry_material_id: item.jewelry_material_id || null,
        thread_type_id: item.thread_type_id || null,
        thickness_mm: item.thickness_mm ? Number(item.thickness_mm) : null,
        length_mm: item.length_mm ? Number(item.length_mm) : null,
        diameter_mm: item.diameter_mm ? Number(item.diameter_mm) : null,
        images: item.images || []
      };

      let result;
      
      if (selectedItem) {
        // Edit existing item
        const { data, error } = await supabase
          .from('inventory')
          .update(cleanedItem)
          .eq('id', selectedItem.id)
          .eq('user_id', user.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Add new item
        const insertData = {
          ...cleanedItem,
          user_id: user.id
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
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] });
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
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
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
    jewelryMaterials,
    threadTypes,
    suppliers,
    inventoryItems,
    filteredInventory,
    isLoading,
    inventoryMutation,
    handleAddItem,
    handleEditItem,
    handleSaveItem
  };
}

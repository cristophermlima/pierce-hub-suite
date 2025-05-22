import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from "sonner";
import { Search, Plus, Edit, Package, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InventoryItem {
  id: string;
  name: string;
  category_id: string | null;
  stock: number;
  price: number;
  threshold: number;
  is_service: boolean;
  category_name?: string;
}

interface Category {
  id: string;
  name: string;
}

interface InventoryMutationData {
  name: string;
  category_id: string | null;
  price: number;
  stock: number;
  threshold: number;
  is_service: boolean;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const queryClient = useQueryClient();

  // Buscar categorias de produtos
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
        const { data, error } = await supabase
          .from('inventory')
          .update({
            name: item.name,
            category_id: item.category_id,
            price: item.price,
            stock: item.stock,
            threshold: item.threshold,
            is_service: item.is_service
          })
          .eq('id', selectedItem.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('inventory')
          .insert({
            name: item.name,
            category_id: item.category_id,
            price: item.price,
            stock: item.stock,
            threshold: item.threshold,
            is_service: item.is_service
          })
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
    },
    onError: (error: any) => {
      console.error('Erro na operação:', error);
      toast.error(`Falha ao ${selectedItem ? 'atualizar' : 'adicionar'} item: ${error.message}`);
    }
  });

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

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const itemData: InventoryMutationData = {
      name: formData.get('name') as string,
      category_id: formData.get('category') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string, 10),
      threshold: parseInt(formData.get('threshold') as string, 10),
      is_service: formData.get('is_service') === 'true'
    };
    
    inventoryMutation.mutate(itemData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="relative w-full sm:w-72">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input 
              placeholder="Buscar inventário..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select 
            value={filterCategory} 
            onValueChange={setFilterCategory}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Todas as Categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleAddItem}>
          <Plus size={18} className="mr-2" />
          Adicionar Item
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Carregando inventário...</span>
        </div>
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const isLowStock = item.stock < item.threshold && !item.is_service;
                  const stockClass = isLowStock ? 'text-red-500 font-semibold' : '';
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell className={`text-right ${stockClass}`}>
                        {item.is_service ? '—' : item.stock}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.is_service ? (
                          <span className="bg-blue-500/20 text-blue-600 text-xs px-2 py-1 rounded-full">
                            Serviço
                          </span>
                        ) : isLowStock ? (
                          <span className="bg-red-500/20 text-red-600 text-xs px-2 py-1 rounded-full">
                            Estoque Baixo
                          </span>
                        ) : (
                          <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded-full">
                            Em Estoque
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum item de inventário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar Item do Inventário' : 'Adicionar Item ao Inventário'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem 
                ? 'Atualize os detalhes do item no inventário.'
                : 'Preencha os detalhes para adicionar um novo item ao inventário.'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveItem} className="space-y-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome do Item
              </label>
              <Input 
                id="name" 
                name="name"
                defaultValue={selectedItem?.name}
                placeholder="Nome do item"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Categoria
              </label>
              <Select name="category" defaultValue={selectedItem?.category_id || ''}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                Tipo de Item
              </label>
              <Select 
                name="is_service" 
                defaultValue={selectedItem?.is_service ? 'true' : 'false'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Produto</SelectItem>
                  <SelectItem value="true">Serviço</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Serviços não consomem estoque e ficam disponíveis mesmo com estoque zerado.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Quantidade em Estoque
                </label>
                <Input 
                  id="stock" 
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={selectedItem?.stock || 0}
                  placeholder="0"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Preço (R$)
                </label>
                <Input 
                  id="price" 
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={selectedItem?.price}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="threshold" className="text-sm font-medium">
                Limite de Estoque Mínimo
              </label>
              <Input 
                id="threshold" 
                name="threshold"
                type="number"
                min="0"
                defaultValue={selectedItem?.threshold || 5}
                placeholder="5"
                required
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={inventoryMutation.isPending}>
                {inventoryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  selectedItem ? 'Salvar Alterações' : 'Adicionar Item'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;

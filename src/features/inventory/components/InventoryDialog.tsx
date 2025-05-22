
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { InventoryItem, Category, InventoryMutationData } from '../types';

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: InventoryItem | null;
  categories: Category[];
  isSubmitting: boolean;
  onSubmit: (data: InventoryMutationData) => void;
}

export function InventoryDialog({
  open,
  onOpenChange,
  selectedItem,
  categories,
  isSubmitting,
  onSubmit
}: InventoryDialogProps) {
  // Use form for controlled inputs
  const { register, handleSubmit, reset, setValue, watch } = useForm<InventoryMutationData>({
    defaultValues: {
      name: '',
      category_id: '',
      price: 0,
      stock: 0,
      threshold: 5,
      is_service: false
    }
  });

  // Reset form when selected item changes
  useEffect(() => {
    if (selectedItem) {
      reset({
        name: selectedItem.name,
        category_id: selectedItem.category_id || '',
        price: selectedItem.price,
        stock: selectedItem.stock,
        threshold: selectedItem.threshold,
        is_service: selectedItem.is_service
      });
    } else {
      reset({
        name: '',
        category_id: '',
        price: 0,
        stock: 0,
        threshold: 5,
        is_service: false
      });
    }
  }, [selectedItem, reset]);

  // Process form submission
  const processSubmit = (formData: InventoryMutationData) => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome do Item
            </label>
            <Input 
              id="name" 
              {...register('name', { required: true })}
              placeholder="Nome do item"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categoria
            </label>
            <Select 
              value={watch('category_id') || ''}
              onValueChange={(value) => setValue('category_id', value)}
            >
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
              value={watch('is_service') ? 'true' : 'false'}
              onValueChange={(value) => setValue('is_service', value === 'true')}
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
                type="number"
                min="0"
                {...register('stock', { 
                  required: true, 
                  valueAsNumber: true,
                  min: 0 
                })}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="price" className="text-sm font-medium">
                Preço (R$)
              </label>
              <Input 
                id="price" 
                type="number"
                step="0.01"
                min="0"
                {...register('price', { 
                  required: true, 
                  valueAsNumber: true,
                  min: 0 
                })}
                placeholder="0,00"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="threshold" className="text-sm font-medium">
              Limite de Estoque Mínimo
            </label>
            <Input 
              id="threshold" 
              type="number"
              min="0"
              {...register('threshold', { 
                required: true, 
                valueAsNumber: true,
                min: 0 
              })}
              placeholder="5"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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
  );
}

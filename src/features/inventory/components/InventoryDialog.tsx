
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { InventoryItem, Category, JewelryMaterial, ThreadType, Supplier, InventoryMutationData } from '../types';
import { BasicInfoSection } from './dialog/BasicInfoSection';
import { JewelrySpecsSection } from './dialog/JewelrySpecsSection';
import { CommercialInfoSection } from './dialog/CommercialInfoSection';
import { FormActionsSection } from './dialog/FormActionsSection';

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: InventoryItem | null;
  categories: Category[];
  jewelryMaterials: JewelryMaterial[];
  threadTypes: ThreadType[];
  suppliers: Supplier[];
  isSubmitting: boolean;
  onSubmit: (data: InventoryMutationData) => void;
}

export function InventoryDialog({
  open,
  onOpenChange,
  selectedItem,
  categories,
  jewelryMaterials,
  threadTypes,
  suppliers,
  isSubmitting,
  onSubmit
}: InventoryDialogProps) {
  const form = useForm<InventoryMutationData>({
    defaultValues: {
      name: '',
      category_id: '',
      price: 0,
      cost_price: 0,
      stock: 0,
      threshold: 5,
      is_service: false,
      sku: '',
      brand: '',
      supplier_id: '',
      jewelry_material_id: '',
      thread_type_id: '',
      thickness_mm: undefined,
      length_mm: undefined,
      diameter_mm: undefined,
      images: []
    }
  });

  const watchCategory = form.watch('category_id');
  const isJewelry = categories.find(cat => cat.id === watchCategory)?.type === 'jewelry';

  // Reset form when selected item changes
  useEffect(() => {
    if (selectedItem) {
      form.reset({
        name: selectedItem.name,
        category_id: selectedItem.category_id || '',
        price: selectedItem.price,
        cost_price: selectedItem.cost_price || 0,
        stock: selectedItem.stock,
        threshold: selectedItem.threshold,
        is_service: selectedItem.is_service,
        sku: selectedItem.sku || '',
        brand: selectedItem.brand || '',
        supplier_id: selectedItem.supplier_id || '',
        jewelry_material_id: selectedItem.jewelry_material_id || '',
        thread_type_id: selectedItem.thread_type_id || '',
        thickness_mm: selectedItem.thickness_mm,
        length_mm: selectedItem.length_mm,
        diameter_mm: selectedItem.diameter_mm,
        images: selectedItem.images || []
      });
    } else {
      form.reset({
        name: '',
        category_id: '',
        price: 0,
        cost_price: 0,
        stock: 0,
        threshold: 5,
        is_service: false,
        sku: '',
        brand: '',
        supplier_id: '',
        jewelry_material_id: '',
        thread_type_id: '',
        thickness_mm: undefined,
        length_mm: undefined,
        diameter_mm: undefined,
        images: []
      });
    }
  }, [selectedItem, form]);

  const processSubmit = (formData: InventoryMutationData) => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedItem ? 'Editar Item do Estoque' : 'Adicionar Item ao Estoque'}
          </DialogTitle>
          <DialogDescription>
            {selectedItem 
              ? 'Atualize os detalhes do item no estoque.'
              : 'Preencha os detalhes para adicionar um novo item ao estoque.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-6">
            <BasicInfoSection 
              control={form.control} 
              categories={categories} 
            />

            {isJewelry && (
              <JewelrySpecsSection 
                control={form.control}
                jewelryMaterials={jewelryMaterials}
                threadTypes={threadTypes}
              />
            )}

            <CommercialInfoSection 
              control={form.control}
              suppliers={suppliers}
            />

            <FormActionsSection 
              isSubmitting={isSubmitting}
              selectedItem={selectedItem}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

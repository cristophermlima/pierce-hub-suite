
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InventoryItem, Category, JewelryMaterial, ThreadType, Supplier, InventoryMutationData } from '../types';

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

  const jewelryCategories = categories.filter(cat => cat.type === 'jewelry');
  const materialCategories = categories.filter(cat => cat.type === 'material');
  const generalCategories = categories.filter(cat => !cat.type || cat.type === 'general');

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
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Nome é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Item *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Labret titânio 8mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU/Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: LAB-TI-8MM-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categoria e Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jewelryCategories.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">Joias</div>
                            {jewelryCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                        {materialCategories.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">Materiais</div>
                            {materialCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                        {generalCategories.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">Geral</div>
                            {generalCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Item</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value === 'true')}
                      value={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="false">Produto Físico</SelectItem>
                        <SelectItem value="true">Serviço</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Serviços não consomem estoque
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos específicos para joias */}
            {isJewelry && (
              <>
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Especificações da Joia</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jewelry_material_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o material" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jewelryMaterials.map((material) => (
                                <SelectItem key={material.id} value={material.id}>
                                  {material.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="thread_type_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Rosca</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo de rosca" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {threadTypes.map((threadType) => (
                                <SelectItem key={threadType.id} value={threadType.id}>
                                  {threadType.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="thickness_mm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Espessura (mm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              placeholder="1.2"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="length_mm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comprimento (mm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              placeholder="8.0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diameter_mm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diâmetro (mm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1" 
                              placeholder="12.0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            Para argolas e similares
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Informações comerciais */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Informações Comerciais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Anatometal, BVLA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o fornecedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="price"
                  rules={{ required: "Preço é obrigatório", min: { value: 0, message: "Preço deve ser positivo" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  rules={{ required: "Quantidade é obrigatória", min: { value: 0, message: "Quantidade deve ser positiva" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade em Estoque *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="threshold"
                  rules={{ required: "Limite mínimo é obrigatório", min: { value: 0, message: "Limite deve ser positivo" } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="5"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                    Salvando...
                  </>
                ) : (
                  selectedItem ? 'Salvar Alterações' : 'Adicionar ao Estoque'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

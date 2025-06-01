
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { Category, InventoryMutationData } from '../../types';

interface BasicInfoSectionProps {
  control: Control<InventoryMutationData>;
  categories: Category[];
}

export function BasicInfoSection({ control, categories }: BasicInfoSectionProps) {
  const jewelryCategories = categories.filter(cat => cat.type === 'jewelry');
  const materialCategories = categories.filter(cat => cat.type === 'material');
  const generalCategories = categories.filter(cat => !cat.type || cat.type === 'general');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
    </div>
  );
}

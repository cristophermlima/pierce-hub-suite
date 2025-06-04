
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Control } from 'react-hook-form';
import { Category, InventoryMutationData } from '../../types';
import { EditableCombobox } from '../EditableCombobox';
import { ImageUpload } from '../ImageUpload';

interface BasicInfoSectionProps {
  control: Control<InventoryMutationData>;
  categories: Category[];
}

const commonItemNames = [
  'Barbell 16G',
  'Labret 16G',
  'Argola Captive',
  'Plug Acrílico',
  'Tunnel Silicone',
  'Banana 14G',
  'Espiral Aço',
  'Hinged Ring',
  'Threadless Top',
  'Dermal Anchor'
];

export function BasicInfoSection({ control, categories }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableCombobox 
          control={control} 
          suggestions={commonItemNames}
        />

        <FormField
          control={control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU</FormLabel>
            <FormControl>
              <Input placeholder="Ex: BRB-16G-8MM" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="is_service"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                É um serviço?
              </FormLabel>
              <div className="text-sm text-muted-foreground">
                Marque se este item representa um serviço ao invés de um produto físico
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <ImageUpload
              images={field.value || []}
              onImagesChange={field.onChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

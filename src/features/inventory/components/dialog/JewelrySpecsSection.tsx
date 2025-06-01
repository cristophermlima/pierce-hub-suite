
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { JewelryMaterial, ThreadType, InventoryMutationData } from '../../types';

interface JewelrySpecsSectionProps {
  control: Control<InventoryMutationData>;
  jewelryMaterials: JewelryMaterial[];
  threadTypes: ThreadType[];
}

export function JewelrySpecsSection({ control, jewelryMaterials, threadTypes }: JewelrySpecsSectionProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">Especificações da Joia</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
}

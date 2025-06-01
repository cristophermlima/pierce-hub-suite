
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { Supplier, InventoryMutationData } from '../../types';

interface CommercialInfoSectionProps {
  control: Control<InventoryMutationData>;
  suppliers: Supplier[];
}

export function CommercialInfoSection({ control, suppliers }: CommercialInfoSectionProps) {
  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">Informações Comerciais</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
}


import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { JewelryMaterial, ThreadType, ThreadSpecification, RingClosure, InventoryMutationData } from '../../types';
import { useState } from 'react';

interface JewelrySpecsSectionProps {
  control: Control<InventoryMutationData>;
  jewelryMaterials: JewelryMaterial[];
  threadTypes: ThreadType[];
  threadSpecifications: ThreadSpecification[];
  ringClosures: RingClosure[];
}

// Tabela de conversão Gauge para MM
const gaugeToMmConversion: { [key: string]: number } = {
  '20g': 0.8,
  '18g': 1.0,
  '16g': 1.2,
  '14g': 1.6,
  '12g': 2.0,
  '10g': 2.5,
  '8g': 3.2,
  '6g': 4.0,
  '4g': 5.0,
  '2g': 6.0,
  '0g': 8.0,
  '00g': 10.0,
};

export function JewelrySpecsSection({ 
  control, 
  jewelryMaterials, 
  threadTypes, 
  threadSpecifications, 
  ringClosures 
}: JewelrySpecsSectionProps) {
  const [thicknessUnit, setThicknessUnit] = useState<'mm' | 'gauge'>('mm');

  const handleGaugeSelection = (gauge: string, onChange: (value: number | undefined) => void) => {
    const mmValue = gaugeToMmConversion[gauge];
    if (mmValue) {
      onChange(mmValue);
    }
  };

  return (
    <div className="border-t pt-4">
      <h3 className="text-lg font-semibold mb-4">Especificações da Joia</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormField
          control={control}
          name="thread_specification_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especificação da Rosca</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a especificação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {threadSpecifications.map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Interna, Externa ou Push Pin
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ring_closure_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Fechamento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fechamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ringClosures.map((closure) => (
                    <SelectItem key={closure.id} value={closure.id}>
                      {closure.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Para argolas: Clicker, Segmento, Torção, Captive
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          control={control}
          name="size_mm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tamanho (mm)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.1" 
                  placeholder="16.0"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </FormControl>
              <FormDescription>
                Tamanho geral da joia
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="thickness_mm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Espessura</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setThicknessUnit('mm')}
                    className={`px-3 py-1 text-xs rounded ${
                      thicknessUnit === 'mm' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    mm
                  </button>
                  <button
                    type="button"
                    onClick={() => setThicknessUnit('gauge')}
                    className={`px-3 py-1 text-xs rounded ${
                      thicknessUnit === 'gauge' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Gauge
                  </button>
                </div>

                {thicknessUnit === 'mm' ? (
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      placeholder="1.2"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                ) : (
                  <Select onValueChange={(value) => handleGaugeSelection(value, field.onChange)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gauge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(gaugeToMmConversion).map(([gauge, mm]) => (
                        <SelectItem key={gauge} value={gauge}>
                          {gauge} ({mm}mm)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <FormDescription>
                {field.value && `Valor atual: ${field.value}mm`}
              </FormDescription>
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
              <FormDescription>
                Para barras, hastes
              </FormDescription>
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
                Para argolas, tunnels
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

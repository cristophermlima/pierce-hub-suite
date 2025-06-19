
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SterilizedMaterial, SterilizedMaterialFormData } from '../types';

interface SterilizedMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: SterilizedMaterial | null;
  onSave: (data: SterilizedMaterialFormData) => void;
  isSubmitting: boolean;
}

export function SterilizedMaterialDialog({
  open,
  onOpenChange,
  material,
  onSave,
  isSubmitting
}: SterilizedMaterialDialogProps) {
  const form = useForm<SterilizedMaterialFormData>({
    defaultValues: {
      name: '',
      category: 'kit',
      quantity_sterile: 0,
      total_quantity: 0,
      sterilization_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      sterilization_method: '',
      batch_number: '',
      notes: ''
    }
  });

  useEffect(() => {
    if (material) {
      form.reset({
        name: material.name,
        category: material.category,
        quantity_sterile: material.quantity_sterile,
        total_quantity: material.total_quantity,
        sterilization_date: material.sterilization_date.split('T')[0],
        expiration_date: material.expiration_date.split('T')[0],
        sterilization_method: material.sterilization_method,
        batch_number: material.batch_number || '',
        notes: material.notes || ''
      });
    } else {
      form.reset({
        name: '',
        category: 'kit',
        quantity_sterile: 0,
        total_quantity: 0,
        sterilization_date: new Date().toISOString().split('T')[0],
        expiration_date: '',
        sterilization_method: '',
        batch_number: '',
        notes: ''
      });
    }
  }, [material, form]);

  const onSubmit = (data: SterilizedMaterialFormData) => {
    onSave(data);
    if (!material) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {material ? 'Editar Material' : 'Novo Material Esterilizado'}
          </DialogTitle>
          <DialogDescription>
            Adicione e controle materiais esterilizados e suas datas de validade
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Material</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Kit Piercing Básico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kit">Kit Esterilizado</SelectItem>
                        <SelectItem value="tool">Ferramenta</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity_sterile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Esterilizada</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sterilization_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Esterilização</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Validade</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sterilization_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Esterilização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Autoclave, UV, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Lote (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: B001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o material ou processo de esterilização"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

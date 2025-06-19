
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SterilizedMaterialFormData>({
    defaultValues: {
      name: '',
      category: 'kit',
      quantity_sterile: 0,
      total_quantity: 0,
      sterilization_date: '',
      expiration_date: '',
      sterilization_method: '',
      batch_number: '',
      notes: ''
    }
  });

  const category = watch('category');

  useEffect(() => {
    if (material) {
      reset({
        name: material.name,
        category: material.category as 'kit' | 'tool' | 'other',
        quantity_sterile: material.quantity_sterile,
        total_quantity: material.total_quantity,
        sterilization_date: material.sterilization_date,
        expiration_date: material.expiration_date,
        sterilization_method: material.sterilization_method,
        batch_number: material.batch_number || '',
        notes: material.notes || ''
      });
    } else {
      reset({
        name: '',
        category: 'kit',
        quantity_sterile: 0,
        total_quantity: 0,
        sterilization_date: '',
        expiration_date: '',
        sterilization_method: '',
        batch_number: '',
        notes: ''
      });
    }
  }, [material, reset]);

  const onSubmit = (data: SterilizedMaterialFormData) => {
    onSave(data);
    if (!material) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {material ? 'Editar Material' : 'Novo Material'} Esterilizado
          </DialogTitle>
          <DialogDescription>
            Gerencie kits e ferramentas esterilizadas para procedimentos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Material</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nome é obrigatório' })}
                placeholder="Ex: Kit Piercing Básico"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(value) => setValue('category', value as 'kit' | 'tool' | 'other')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kit">Kit</SelectItem>
                  <SelectItem value="tool">Ferramenta</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity_sterile">Quantidade Estéril</Label>
              <Input
                id="quantity_sterile"
                type="number"
                min="0"
                {...register('quantity_sterile', { 
                  required: 'Quantidade estéril é obrigatória',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Deve ser maior ou igual a 0' }
                })}
              />
              {errors.quantity_sterile && (
                <p className="text-sm text-red-500">{errors.quantity_sterile.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_quantity">Quantidade Total</Label>
              <Input
                id="total_quantity"
                type="number"
                min="0"
                {...register('total_quantity', { 
                  required: 'Quantidade total é obrigatória',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Deve ser maior ou igual a 0' }
                })}
              />
              {errors.total_quantity && (
                <p className="text-sm text-red-500">{errors.total_quantity.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sterilization_date">Data de Esterilização</Label>
              <Input
                id="sterilization_date"
                type="date"
                {...register('sterilization_date', { required: 'Data de esterilização é obrigatória' })}
              />
              {errors.sterilization_date && (
                <p className="text-sm text-red-500">{errors.sterilization_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration_date">Data de Validade</Label>
              <Input
                id="expiration_date"
                type="date"
                {...register('expiration_date', { required: 'Data de validade é obrigatória' })}
              />
              {errors.expiration_date && (
                <p className="text-sm text-red-500">{errors.expiration_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sterilization_method">Método de Esterilização</Label>
              <Input
                id="sterilization_method"
                {...register('sterilization_method', { required: 'Método é obrigatório' })}
                placeholder="Ex: Autoclave"
              />
              {errors.sterilization_method && (
                <p className="text-sm text-red-500">{errors.sterilization_method.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch_number">Número do Lote (Opcional)</Label>
              <Input
                id="batch_number"
                {...register('batch_number')}
                placeholder="Ex: L2024001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (Opcional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Informações adicionais sobre o material..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
      </DialogContent>
    </Dialog>
  );
}

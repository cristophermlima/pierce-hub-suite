
import React, { useEffect, useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2 } from 'lucide-react';
import { AftercareTemplate, AftercareFormData, AftercareKitItem } from '../types';
import { useAppSettings } from '@/context/AppSettingsContext';

interface AftercareTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: AftercareTemplate | null;
  onSave: (data: AftercareFormData) => void;
  isSubmitting: boolean;
}

export function AftercareTemplateDialog({
  open,
  onOpenChange,
  template,
  onSave,
  isSubmitting
}: AftercareTemplateDialogProps) {
  const { formatCurrency } = useAppSettings();
  const [kitItems, setKitItems] = useState<AftercareKitItem[]>([]);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<AftercareFormData>({
    defaultValues: {
      name: '',
      title: '',
      content: '',
      is_active: true
    }
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        title: template.title,
        content: template.content,
        is_active: template.is_active
      });
      setKitItems(template.kit_items || []);
    } else {
      reset({
        name: '',
        title: '',
        content: '',
        is_active: true
      });
      setKitItems([]);
    }
  }, [template, reset]);

  const addKitItem = () => {
    setKitItems([...kitItems, { name: '', quantity: 1, cost: 0 }]);
  };

  const removeKitItem = (index: number) => {
    setKitItems(kitItems.filter((_, i) => i !== index));
  };

  const updateKitItem = (index: number, field: keyof AftercareKitItem, value: string | number) => {
    const updated = [...kitItems];
    if (field === 'name') {
      updated[index].name = value as string;
    } else if (field === 'quantity') {
      updated[index].quantity = Number(value) || 0;
    } else if (field === 'cost') {
      updated[index].cost = Number(value) || 0;
    }
    setKitItems(updated);
  };

  const totalCost = kitItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

  const onSubmit = (data: AftercareFormData) => {
    onSave({
      ...data,
      kit_items: kitItems.length > 0 ? kitItems : undefined
    });
    if (!template) {
      reset();
      setKitItems([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar' : 'Novo'} Kit de Cuidados Pós-Procedimento
          </DialogTitle>
          <DialogDescription>
            Configure o kit com materiais como soro, sabonete neutro, gaze, cotonete, instruções e brindes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Kit</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome é obrigatório' })}
              placeholder="Ex: Kit Cuidados Pós-Piercing"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título da Mensagem</Label>
            <Input
              id="title"
              {...register('title', { required: 'Título é obrigatório' })}
              placeholder="Ex: Cuidados importantes para seu piercing"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Instruções de Cuidados</Label>
            <Textarea
              id="content"
              {...register('content', { required: 'Conteúdo é obrigatório' })}
              placeholder="Digite aqui as instruções de cuidados que serão enviadas ao cliente..."
              rows={6}
              className="resize-none"
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>

          {/* Kit Items Section */}
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold">Itens do Kit</Label>
                <p className="text-sm text-muted-foreground">
                  Adicione os materiais que compõem o kit de cuidados
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addKitItem}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Item
              </Button>
            </div>

            {kitItems.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                  <div className="col-span-5">Material</div>
                  <div className="col-span-2">Qtd</div>
                  <div className="col-span-3">Custo Unit.</div>
                  <div className="col-span-2"></div>
                </div>
                
                {kitItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Ex: Soro fisiológico"
                        value={item.name}
                        onChange={(e) => updateKitItem(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateKitItem(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.cost || ''}
                        onChange={(e) => updateKitItem(index, 'cost', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeKitItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-2 border-t">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Custo Total do Kit</p>
                    <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
                  </div>
                </div>
              </div>
            )}

            {kitItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum item adicionado. Clique em "Adicionar Item" para incluir materiais no kit.
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active" className="text-sm">
              Kit ativo (será usado automaticamente em vendas)
            </Label>
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

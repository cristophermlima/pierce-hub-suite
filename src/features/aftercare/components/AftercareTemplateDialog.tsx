
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
import { Switch } from '@/components/ui/switch';
import { AftercareTemplate, AftercareFormData } from '../types';

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
    } else {
      reset({
        name: '',
        title: '',
        content: '',
        is_active: true
      });
    }
  }, [template, reset]);

  const onSubmit = (data: AftercareFormData) => {
    onSave(data);
    if (!template) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Template' : 'Novo Template'} de Cuidados
          </DialogTitle>
          <DialogDescription>
            Crie templates de mensagens que serão enviadas automaticamente 2h após procedimentos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Template</Label>
            <Input
              id="name"
              {...register('name', { required: 'Nome é obrigatório' })}
              placeholder="Ex: Cuidados Pós-Piercing"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
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
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo da Mensagem</Label>
            <Textarea
              id="content"
              {...register('content', { required: 'Conteúdo é obrigatório' })}
              placeholder="Digite aqui as instruções de cuidados..."
              rows={8}
              className="resize-none"
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <Label htmlFor="is_active" className="text-sm">
              Template ativo (será usado automaticamente em vendas)
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

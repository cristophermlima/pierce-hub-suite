
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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
  const form = useForm<AftercareFormData>({
    defaultValues: {
      name: '',
      title: 'Cuidados Pós-Procedimento',
      content: `🔸 LIMPEZA:
Limpe delicadamente com sabonete neutro, 1x ao dia, sempre com um cotonete

🔸 HIDRATAÇÃO:
Use soro fisiológico gelado durante os primeiros 5 dias para reduzir inchaço

🔸 MANTER SECO:
Após limpeza, seque cuidadosamente e não faça movimentos circulares

⚠️ EVITAR:
- Alimentos gordurosos, frituras, embutidos, doces
- Drogas, álcool, cigarro, cafeína nas primeiras 2 semanas
- Girar ou mexer na joia
- Dormir em cima do piercing
- Piscina, mar, rio por 2 semanas

📞 Em caso de dúvidas, entre em contato conosco!`,
      is_active: true
    }
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        title: template.title,
        content: template.content,
        is_active: template.is_active
      });
    } else {
      form.reset({
        name: '',
        title: 'Cuidados Pós-Procedimento',
        content: `🔸 LIMPEZA:
Limpe delicadamente com sabonete neutro, 1x ao dia, sempre com um cotonete

🔸 HIDRATAÇÃO:
Use soro fisiológico gelado durante os primeiros 5 dias para reduzir inchaço

🔸 MANTER SECO:
Após limpeza, seque cuidadosamente e não faça movimentos circulares

⚠️ EVITAR:
- Alimentos gordurosos, frituras, embutidos, doces
- Drogas, álcool, cigarro, cafeína nas primeiras 2 semanas
- Girar ou mexer na joia
- Dormir em cima do piercing
- Piscina, mar, rio por 2 semanas

📞 Em caso de dúvidas, entre em contato conosco!`,
        is_active: true
      });
    }
  }, [template, form]);

  const onSubmit = (data: AftercareFormData) => {
    onSave(data);
    if (!template) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Editar Template' : 'Novo Template de Cuidados'}
          </DialogTitle>
          <DialogDescription>
            Crie templates de cuidados pós-procedimento para envio automático
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Template</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Piercing Orelha Padrão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Mensagem</FormLabel>
                  <FormControl>
                    <Input placeholder="Cuidados Pós-Procedimento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo da Mensagem</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite as instruções de cuidados..."
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use emojis e formatação para tornar a mensagem mais atrativa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <FormDescription>
                      Template ativo será enviado automaticamente
                    </FormDescription>
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

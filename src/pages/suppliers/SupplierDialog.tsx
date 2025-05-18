
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

// Define schema for supplier form
const supplierFormSchema = z.object({
  name: z.string().min(2, "Nome da empresa é obrigatório"),
  contactName: z.string().min(2, "Nome do contato é obrigatório"),
  phone: z.string().min(8, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  category: z.string().min(1, "Categoria é obrigatória"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional()
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

export type Supplier = {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
};

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSupplier: Supplier | null;
  onSubmit: (data: SupplierFormValues) => void;
}

export const SupplierDialog = ({ 
  open, 
  onOpenChange, 
  selectedSupplier, 
  onSubmit 
}: SupplierDialogProps) => {
  const { toast } = useToast();
  
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: selectedSupplier?.name || '',
      contactName: selectedSupplier?.contact || '',
      phone: selectedSupplier?.phone || '',
      email: selectedSupplier?.email || '',
      category: selectedSupplier?.category || '',
      address: selectedSupplier?.address || '',
      city: selectedSupplier?.city || '',
      state: selectedSupplier?.state || '',
      zipCode: selectedSupplier?.zipCode || '',
      notes: selectedSupplier?.notes || '',
    }
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: selectedSupplier?.name || '',
        contactName: selectedSupplier?.contact || '',
        phone: selectedSupplier?.phone || '',
        email: selectedSupplier?.email || '',
        category: selectedSupplier?.category || '',
        address: selectedSupplier?.address || '',
        city: selectedSupplier?.city || '',
        state: selectedSupplier?.state || '',
        zipCode: selectedSupplier?.zipCode || '',
        notes: selectedSupplier?.notes || '',
      });
    }
  }, [open, selectedSupplier, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    onOpenChange(false);
    toast({
      title: selectedSupplier ? "Fornecedor atualizado" : "Fornecedor adicionado",
      description: selectedSupplier ? "As informações do fornecedor foram atualizadas com sucesso." : "Novo fornecedor adicionado com sucesso.",
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedSupplier ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}
          </DialogTitle>
          <DialogDescription>
            {selectedSupplier 
              ? 'Edite as informações do fornecedor.'
              : 'Preencha os detalhes para adicionar um novo fornecedor.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 pr-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Contato</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do contato principal" {...field} />
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
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Joias">Joias</SelectItem>
                            <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                            <SelectItem value="Esterilização">Esterilização</SelectItem>
                            <SelectItem value="Produtos de Limpeza">Produtos de Limpeza</SelectItem>
                            <SelectItem value="Joias Importadas">Joias Importadas</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="Estado" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} />
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
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações adicionais sobre o fornecedor" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedSupplier ? 'Salvar Alterações' : 'Adicionar Fornecedor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

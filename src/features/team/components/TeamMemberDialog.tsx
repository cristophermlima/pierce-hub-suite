import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { TeamMember, TeamMemberInput } from '../hooks/useTeamMembers';

const formSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'Selecione um cargo'),
  permissions: z.object({
    pos: z.boolean(),
    clients: z.boolean(),
    inventory: z.boolean(),
    reports: z.boolean(),
    settings: z.boolean(),
    appointments: z.boolean(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: TeamMember | null;
  onSubmit: (data: TeamMemberInput) => void;
  isLoading?: boolean;
}

const DEFAULT_PERMISSIONS = {
  pos: true,
  clients: true,
  inventory: false,
  reports: false,
  settings: false,
  appointments: true,
};

export function TeamMemberDialog({
  open,
  onOpenChange,
  member,
  onSubmit,
  isLoading,
}: TeamMemberDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'employee',
      permissions: DEFAULT_PERMISSIONS,
    },
  });

  React.useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        email: member.email,
        role: member.role,
        permissions: member.permissions || DEFAULT_PERMISSIONS,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'employee',
        permissions: DEFAULT_PERMISSIONS,
      });
    }
  }, [member, open]);

  const handleSubmit = (values: FormValues) => {
    const data: TeamMemberInput = {
      name: values.name,
      email: values.email,
      role: values.role,
      permissions: {
        pos: values.permissions.pos,
        clients: values.permissions.clients,
        inventory: values.permissions.inventory,
        reports: values.permissions.reports,
        settings: values.permissions.settings,
        appointments: values.permissions.appointments,
      },
    };
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {member ? 'Editar Membro' : 'Convidar Membro da Equipe'}
          </DialogTitle>
          {!member && (
            <p className="text-sm text-muted-foreground">
              Um email será enviado para o membro criar sua senha de acesso.
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      {...field} 
                      disabled={!!member}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employee">Funcionário</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="receptionist">Recepcionista</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Permissões</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="permissions.pos"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">PDV</span>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.clients"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">Clientes</span>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.appointments"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">Agenda</span>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.inventory"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">Estoque</span>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.reports"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">Relatórios</span>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="permissions.settings"
                  render={({ field }) => (
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">Configurações</span>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {member ? 'Salvar' : 'Enviar Convite'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

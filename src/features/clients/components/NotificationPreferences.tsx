
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { ClientFormValues } from '../schemas/clientFormSchema';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface NotificationPreferencesProps {
  form: UseFormReturn<ClientFormValues>;
}

export const NotificationPreferences = ({ form }: NotificationPreferencesProps) => {
  return (
    <div className="space-y-4 bg-secondary/20 p-4 rounded-lg">
      <h3 className="font-medium text-lg">Preferências de Notificação</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Aniversário</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="sendBirthdayMessage"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Enviar mensagem de aniversário</FormLabel>
              <FormDescription>
                Cliente receberá uma mensagem automática de felicitações no dia do aniversário.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sendHolidayMessages"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Enviar mensagens em datas comemorativas</FormLabel>
              <FormDescription>
                Cliente receberá mensagens automáticas em datas especiais como Natal, Ano Novo, Páscoa e outras datas comemorativas.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

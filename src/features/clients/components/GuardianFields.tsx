import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../schemas/clientFormSchema';
import { DocumentUpload } from './DocumentUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface GuardianFieldsProps {
  form: UseFormReturn<ClientFormValues>;
}

export const GuardianFields = ({ form }: GuardianFieldsProps) => {
  const guardianDocumentUrl = form.watch('guardianDocumentUrl');

  return (
    <div className="space-y-4 border-l-4 border-primary pl-4 py-2">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Responsável Legal</strong>
          <p className="text-sm mt-1">
            Como o cliente é menor de 18 anos, é necessário o consentimento de um responsável legal. 
            Por favor, preencha os dados abaixo:
          </p>
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="guardianName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo do Responsável Legal *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite o nome completo do responsável legal" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Declaro que autorizo o procedimento mencionado e me responsabilizo pelas informações prestadas.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel>Documento de Identidade do Responsável *</FormLabel>
        <DocumentUpload
          documentUrl={guardianDocumentUrl}
          onDocumentChange={(url) => form.setValue('guardianDocumentUrl', url)}
          clientId={`guardian-${Date.now()}`}
        />
      </div>
    </div>
  );
};

import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import { ClientFormValues } from '../schemas/clientFormSchema';
import { PublicDocumentUpload } from './PublicDocumentUpload';

interface PublicAnamnesisFormProps {
  control: Control<ClientFormValues>;
}

export const PublicAnamnesisForm = ({ control }: PublicAnamnesisFormProps) => {
  return (
    <div className="space-y-8">
      {/* Dados Pessoais */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">Dados Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu.email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço Completo</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro, cidade, estado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="identityDocumentUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PublicDocumentUpload 
                  documentUrl={field.value}
                  onDocumentChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Histórico de Saúde */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">Histórico de Saúde</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="epilepsy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Epilepsia</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="hemophilia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Hemofilia</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="diabetes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Diabetes</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="heartDisease"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Doenças Cardíacas</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="anemia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Anemia</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="keloid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Queloide</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="dst"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">DSTs</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="hepatitis"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Hepatite</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="dermatitis"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Dermatite</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="otherHealthIssue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outros problemas de saúde</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Descreva aqui se houver" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alergias</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Descreva suas alergias" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Estilo de Vida */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">Estilo de Vida</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={control}
            name="physicalActivity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Atividade física</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="alcohol"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Bebida alcoólica</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="smoke"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Cigarro</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="drugs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Outras drogas</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="goodMeals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alimentou-se bem nas últimas 24h?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Sim/Não" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="mealQuality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Como considera sua alimentação?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Boa/Regular/Ruim" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="sleepHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horas de sono por dia</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: 8 horas" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Medicamentos e Pressão */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">Medicamentos e Saúde</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="medication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faz uso de medicamentos?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Sim/Não" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="whichMedication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quais medicamentos?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Liste os medicamentos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="bloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pressão sanguínea</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Normal/Alta/Baixa" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Saúde Mental */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">Saúde Mental</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="mentalHealth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Como está sua saúde mental?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Boa/Regular/Precisa de cuidados" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="anxiety"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sofre de ansiedade?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Sim/Não/Às vezes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="depression"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sofre de depressão?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Sim/Não/Às vezes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="panic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sofre de síndrome do pânico?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Sim/Não/Às vezes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Informações do Procedimento */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">Sobre o Procedimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="applicationLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local da aplicação</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Orelha, nariz, etc" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="jewel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de joia desejada</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Argola, pino, etc" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do procedimento</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: R$ 100,00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações adicionais</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Alguma observação importante sobre o procedimento ou sua saúde"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Preferências de Notificação */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-primary">Preferências de Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="sendBirthdayMessage"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Receber mensagem de aniversário
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Enviaremos uma mensagem especial no seu aniversário
                  </p>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="sendHolidayMessages"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-lg">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Receber mensagens em datas comemorativas
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Natal, Ano Novo, Dia das Mães, etc.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
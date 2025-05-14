
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
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../schemas/clientFormSchema';

interface AnamnesisFormProps {
  form: UseFormReturn<ClientFormValues>;
  tab: string;
}

export const AnamnesisForm = ({ form, tab }: AnamnesisFormProps) => {
  if (tab === 'saude') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Histórico de Saúde</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="epilepsy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Epilepsia</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hemophilia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Hemofilia</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="diabetes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Diabetes</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="heartDisease"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Doenças Cardíacas</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="anemia"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Anemia</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="keloid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Queloide</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dst"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>DSTs</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hepatitis"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Hepatite</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dermatitis"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Dermatite</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="otherHealthIssue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tem algum problema de saúde?</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Descreva aqui" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tem alguma alergia?</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Descreva aqui" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    );
  }
  
  if (tab === 'estilo') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Estilo de Vida</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="physicalActivity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Atividade física</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="alcohol"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Bebida alcoólica</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="smoke"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Cigarro</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="drugs"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Outras drogas</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="goodMeals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alimentou-se bem nas últimas 24 horas?</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Resposta" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mealQuality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Como considera a sua alimentação?</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Resposta" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sleepHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dorme quantas horas por dia?</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Resposta" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Informações Importantes</h3>
          
          <FormField
            control={form.control}
            name="medication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faz uso de algum medicamento?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resposta" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="whichMedication"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resposta" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pressão sanguínea normal/alta/baixa?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resposta" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Saúde Mental</h3>
          
          <FormField
            control={form.control}
            name="mentalHealth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saudável?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resposta" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="anxiety"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ansiedade?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resposta" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="depression"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Depressão?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resposta" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="panic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pânico?</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resposta" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }
  
  if (tab === 'procedimento') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Procedimento</h3>
        
        <FormField
          control={form.control}
          name="applicationLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local da aplicação</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Orelha, nariz, etc" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="jewel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Descreva a joia utilizada" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Observações adicionais" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input {...field} placeholder="R$ 0,00" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="mt-6 p-4 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            DECLARO QUE RECEBI TODAS AS INFORMAÇÕES REFERENTES AO PROCEDIMENTO UTILIZADO, BEM COMO AOS 
            CUIDADOS A SEREM TOMADOS DEPOIS DA REALIZAÇÃO DO MESMO. VERIFICO QUE OS MATERIAIS UTILIZADOS SÃO 
            DEVIDAMENTE ESTERILIZADOS E LACRADOS, BEM COMO VERIFIQUEI QUE OS MATERIAIS SÃO DESCARTADOS 
            APÓS O PROCEDIMENTO, AUTORIZO A VERIFICAÇÃO DO MATERIAL EXECUTADO ATRAVÉS DAS MINHAS 
            REDES SOCIAIS, ISENTANDO-O DE QUALQUER BÔNUS E/OU ÔNUS ADVINDO DA EXPOSIÇÃO DA MINHA IMAGEM.
          </p>
        </div>
      </div>
    );
  }
  
  // Default tab (dados)
  return (
    <div className="grid gap-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome completo" />
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
              <Input {...field} type="email" placeholder="cliente@exemplo.com" />
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
              <Input {...field} placeholder="(00) 00000-0000" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Nascimento</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Endereço completo" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};


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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientFormValues, clientFormSchema } from '../schemas/clientFormSchema';
import { Client } from '../types';
import { AnamnesisForm } from './AnamnesisForm';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClient: Client | null;
  onSubmit: (data: ClientFormValues) => void;
}

export const ClientDialog = ({ open, onOpenChange, selectedClient, onSubmit }: ClientDialogProps) => {
  const [activeTab, setActiveTab] = React.useState('dados');

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: selectedClient?.name || '',
      email: selectedClient?.email || '',
      phone: selectedClient?.phone || '',
      birthDate: selectedClient?.birthDate || '',
      age: undefined,
      isMinor: false,
      guardianName: '',
      guardianDocumentUrl: '',
      identityDocumentUrl: '',
      sendBirthdayMessage: selectedClient?.sendBirthdayMessage || false,
      sendHolidayMessages: selectedClient?.sendHolidayMessages || false,
      epilepsy: selectedClient?.anamnesis?.epilepsy || false,
      hemophilia: selectedClient?.anamnesis?.hemophilia || false,
      diabetes: selectedClient?.anamnesis?.diabetes || false,
      heartDisease: selectedClient?.anamnesis?.heartDisease || false,
      anemia: selectedClient?.anamnesis?.anemia || false,
      keloid: selectedClient?.anamnesis?.keloid || false,
      dst: selectedClient?.anamnesis?.dst || false,
      hepatitis: selectedClient?.anamnesis?.hepatitis || false,
      dermatitis: selectedClient?.anamnesis?.dermatitis || false,
      physicalActivity: selectedClient?.anamnesis?.physicalActivity || false,
      alcohol: selectedClient?.anamnesis?.alcohol || false,
      smoke: selectedClient?.anamnesis?.smoke || false,
      drugs: selectedClient?.anamnesis?.drugs || false,
      address: selectedClient?.anamnesis?.address || '',
      otherHealthIssue: selectedClient?.anamnesis?.otherHealthIssue || '',
      allergies: selectedClient?.anamnesis?.allergies || '',
      goodMeals: selectedClient?.anamnesis?.goodMeals || '',
      mealQuality: selectedClient?.anamnesis?.mealQuality || '',
      sleepHours: selectedClient?.anamnesis?.sleepHours || '',
      medication: selectedClient?.anamnesis?.medication || '',
      whichMedication: selectedClient?.anamnesis?.whichMedication || '',
      bloodPressure: selectedClient?.anamnesis?.bloodPressure || '',
      mentalHealth: selectedClient?.anamnesis?.mentalHealth || '',
      anxiety: selectedClient?.anamnesis?.anxiety || '',
      depression: selectedClient?.anamnesis?.depression || '',
      panic: selectedClient?.anamnesis?.panic || '',
      applicationLocation: selectedClient?.anamnesis?.applicationLocation || '',
      jewel: selectedClient?.anamnesis?.jewel || '',
      observation: selectedClient?.anamnesis?.observation || '',
      value: selectedClient?.anamnesis?.value || '',
    }
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: selectedClient?.name || '',
        email: selectedClient?.email || '',
        phone: selectedClient?.phone || '',
        birthDate: selectedClient?.birthDate || '',
        age: undefined,
        isMinor: false,
        guardianName: '',
        guardianDocumentUrl: '',
        identityDocumentUrl: '',
        sendBirthdayMessage: selectedClient?.sendBirthdayMessage || false,
        sendHolidayMessages: selectedClient?.sendHolidayMessages || false,
        epilepsy: selectedClient?.anamnesis?.epilepsy || false,
        hemophilia: selectedClient?.anamnesis?.hemophilia || false,
        diabetes: selectedClient?.anamnesis?.diabetes || false,
        heartDisease: selectedClient?.anamnesis?.heartDisease || false,
        anemia: selectedClient?.anamnesis?.anemia || false,
        keloid: selectedClient?.anamnesis?.keloid || false,
        dst: selectedClient?.anamnesis?.dst || false,
        hepatitis: selectedClient?.anamnesis?.hepatitis || false,
        dermatitis: selectedClient?.anamnesis?.dermatitis || false,
        physicalActivity: selectedClient?.anamnesis?.physicalActivity || false,
        alcohol: selectedClient?.anamnesis?.alcohol || false,
        smoke: selectedClient?.anamnesis?.smoke || false,
        drugs: selectedClient?.anamnesis?.drugs || false,
        address: selectedClient?.anamnesis?.address || '',
        otherHealthIssue: selectedClient?.anamnesis?.otherHealthIssue || '',
        allergies: selectedClient?.anamnesis?.allergies || '',
        goodMeals: selectedClient?.anamnesis?.goodMeals || '',
        mealQuality: selectedClient?.anamnesis?.mealQuality || '',
        sleepHours: selectedClient?.anamnesis?.sleepHours || '',
        medication: selectedClient?.anamnesis?.medication || '',
        whichMedication: selectedClient?.anamnesis?.whichMedication || '',
        bloodPressure: selectedClient?.anamnesis?.bloodPressure || '',
        mentalHealth: selectedClient?.anamnesis?.mentalHealth || '',
        anxiety: selectedClient?.anamnesis?.anxiety || '',
        depression: selectedClient?.anamnesis?.depression || '',
        panic: selectedClient?.anamnesis?.panic || '',
        applicationLocation: selectedClient?.anamnesis?.applicationLocation || '',
        jewel: selectedClient?.anamnesis?.jewel || '',
        observation: selectedClient?.anamnesis?.observation || '',
        value: selectedClient?.anamnesis?.value || '',
      });
      setActiveTab('dados');
    }
  }, [open, selectedClient, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
          </DialogTitle>
          <DialogDescription>
            {selectedClient 
              ? 'Edite as informações do cliente.'
              : 'Preencha os detalhes para adicionar um novo cliente.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ScrollArea className="h-[60vh]">
              <div className="pr-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="saude">Histórico de Saúde</TabsTrigger>
                    <TabsTrigger value="estilo">Estilo de Vida</TabsTrigger>
                    <TabsTrigger value="procedimento">Procedimento</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="dados" className="pt-4">
                    <AnamnesisForm form={form} tab="dados" />
                  </TabsContent>
                  
                  <TabsContent value="saude" className="pt-4">
                    <AnamnesisForm form={form} tab="saude" />
                  </TabsContent>
                  
                  <TabsContent value="estilo" className="pt-4">
                    <AnamnesisForm form={form} tab="estilo" />
                  </TabsContent>
                  
                  <TabsContent value="procedimento" className="pt-4">
                    <AnamnesisForm form={form} tab="procedimento" />
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedClient ? 'Salvar Alterações' : 'Adicionar Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

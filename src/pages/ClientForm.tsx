import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Loader2, CheckCircle } from 'lucide-react';

import { ClientFormValues, clientFormSchema } from '@/features/clients/schemas/clientFormSchema';
import { PublicAnamnesisForm } from '@/features/clients/components/PublicAnamnesisForm';
import { getClientByToken, submitClientForm } from '@/features/clients/services/clientFormService';
import { Client } from '@/features/clients/types';

const ClientForm = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      sendBirthdayMessage: false,
      sendHolidayMessages: false,
      address: '',
      epilepsy: false,
      hemophilia: false,
      diabetes: false,
      heartDisease: false,
      anemia: false,
      keloid: false,
      dst: false,
      hepatitis: false,
      dermatitis: false,
      otherHealthIssue: '',
      allergies: '',
      physicalActivity: false,
      alcohol: false,
      smoke: false,
      drugs: false,
      goodMeals: '',
      mealQuality: '',
      sleepHours: '',
      medication: '',
      whichMedication: '',
      bloodPressure: '',
      mentalHealth: '',
      anxiety: '',
      depression: '',
      panic: '',
      applicationLocation: '',
      jewel: '',
      observation: '',
      value: '',
    }
  });

  useEffect(() => {
    const loadClient = async () => {
      if (!token) {
        setError('Token não fornecido');
        setLoading(false);
        return;
      }

      try {
        const clientData = await getClientByToken(token);
        if (!clientData) {
          setError('Link inválido ou expirado');
          setLoading(false);
          return;
        }

        setClient(clientData);
        
        // Keep form empty for new client registration - don't prefill any data

        setLoading(false);
      } catch (err) {
        console.error('Error loading client:', err);
        setError('Erro ao carregar dados do cliente');
        setLoading(false);
      }
    };

    loadClient();
  }, [token, form]);

  const onSubmit = async (data: ClientFormValues) => {
    if (!token) return;

    setSubmitting(true);
    try {
      const success = await submitClientForm(token, data);
      if (success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando formulário...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center space-x-2">
              <CheckCircle className="h-6 w-6" />
              <span>Formulário Enviado!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Obrigado por preencher o formulário. Suas informações foram atualizadas com sucesso.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Cadastro e Anamnese</CardTitle>
            <CardDescription>
              Por favor, preencha todas as suas informações para se cadastrar no sistema e completar a anamnese.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <PublicAnamnesisForm control={form.control} />
                
                <div className="flex justify-end pt-6">
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="min-w-32"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar Formulário'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientForm;
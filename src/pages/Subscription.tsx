
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

const Subscription = () => {
  const navigate = useNavigate();
  const { subscription, daysRemaining, isTrial, hasActiveAccess } = useSubscription();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Planos de Assinatura</h1>
            <p className="text-muted-foreground">
              Escolha o plano ideal para seu estúdio de piercing
            </p>
          </div>
        </div>

        {isTrial && hasActiveAccess && (
          <Card className="mb-8 border-orange-500 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold">Período de Teste Ativo</p>
                  <p className="text-sm text-muted-foreground">
                    {daysRemaining} dias restantes do seu teste gratuito
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plano Gratuito */}
          <Card className={isTrial ? "border-orange-500" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Teste Gratuito
                {isTrial && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">ATIVO</span>}
              </CardTitle>
              <CardDescription>
                Experimente todas as funcionalidades por 10 dias
              </CardDescription>
              <div className="text-3xl font-bold">
                R$ 0
                <span className="text-lg font-normal text-muted-foreground">/10 dias</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Gestão completa de clientes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Controle de estoque</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Sistema de agendamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Programa de fidelidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Relatórios básicos</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={isTrial}
              >
                {isTrial ? 'Plano Ativo' : 'Período Expirado'}
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Plano Premium
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">RECOMENDADO</span>
              </CardTitle>
              <CardDescription>
                Acesso completo e ilimitado a todas as funcionalidades
              </CardDescription>
              <div className="text-3xl font-bold">
                R$ 49,90
                <span className="text-lg font-normal text-muted-foreground">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Todas as funcionalidades do teste</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Backup automático diário</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Suporte prioritário</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Relatórios avançados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Integração com WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Sem limite de clientes</span>
                </div>
              </div>
              <Button className="w-full">
                <Crown className="mr-2 h-4 w-4" />
                Assinar Agora
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Cancele a qualquer momento
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Precisa de ajuda? Entre em contato conosco em{" "}
            <a href="mailto:suporte@piercerhub.com" className="text-primary hover:underline">
              suporte@piercerhub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscription;

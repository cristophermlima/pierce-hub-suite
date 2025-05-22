
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      name: 'Mensal',
      price: 'R$ 19,90',
      period: 'por mês',
      description: 'Para quem quer experimentar',
      features: [
        'Agendamentos Ilimitados',
        'Gestão de Clientes',
        'Controle de Inventário',
        'Gerenciamento de Fornecedores',
        'PDV Completo',
        'Programa de Fidelidade',
        'Suporte por Email',
      ]
    },
    yearly: {
      name: 'Anual',
      price: 'R$ 159,90',
      period: 'por ano',
      description: 'Economize 33% no pagamento anual',
      features: [
        'Todas as vantagens do plano mensal',
        'Relatórios Avançados',
        'Exportação de Dados',
        'Backup Automático',
        'Múltiplos Usuários',
        'Suporte Prioritário',
        'Suporte técnico por telefone',
      ]
    }
  };

  const handleGetStarted = () => {
    setIsProcessing(true);
    // Simulação de processamento
    setTimeout(() => {
      window.location.href = '/auth?signup=true';
    }, 1500);
  };

  const handleSelectPlan = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-bold text-xl text-primary">PiercerHub</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Button asChild>
              <Link to="/auth?signup=true">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container max-w-6xl py-12 md:py-24">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Gerencie seu estúdio<br /> com o <span className="text-primary">PiercerHub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            O sistema completo para gestão de estúdios de piercing e body modification.
            Agende clientes, gerencie inventário e aumente suas vendas.
          </p>
        </div>

        {/* Trial Banner */}
        <div className="mt-12 mb-8 bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
          <h2 className="text-xl font-bold">Experimente grátis por 7 dias</h2>
          <p className="text-muted-foreground">
            Acesso completo a todas as funcionalidades, sem compromisso
          </p>
        </div>

        {/* Plans Selector */}
        <div className="flex justify-center mt-8 mb-12">
          <div className="bg-muted rounded-lg p-1 flex">
            <button
              onClick={() => handleSelectPlan('monthly')}
              className={cn(
                "px-4 py-2 rounded-md transition-all",
                selectedPlan === 'monthly' 
                  ? "bg-background shadow-sm" 
                  : "hover:bg-background/60"
              )}
            >
              Mensal
            </button>
            <button
              onClick={() => handleSelectPlan('yearly')}
              className={cn(
                "px-4 py-2 rounded-md transition-all",
                selectedPlan === 'yearly' 
                  ? "bg-background shadow-sm" 
                  : "hover:bg-background/60"
              )}
            >
              Anual
            </button>
          </div>
        </div>

        {/* Plan Details */}
        <div className="max-w-md mx-auto">
          <Card className={cn(
            "transition-all duration-300",
            selectedPlan === 'yearly' ? "border-primary" : ""
          )}>
            <CardHeader>
              <CardTitle>{plans[selectedPlan].name}</CardTitle>
              <CardDescription>{plans[selectedPlan].description}</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plans[selectedPlan].price}</span>
                <span className="text-muted-foreground ml-2">
                  {plans[selectedPlan].period}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plans[selectedPlan].features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleGetStarted}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Começar agora'
                )}
              </Button>
            </CardFooter>
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-4">
            7 dias de teste grátis, cancele a qualquer momento
          </p>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container max-w-6xl">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
            Tudo que você precisa para seu estúdio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-6 border">
              <h3 className="font-bold text-lg mb-2">Agendamentos Inteligentes</h3>
              <p className="text-muted-foreground">
                Gerencie sua agenda de forma eficiente, evite conflitos e envie lembretes automáticos para seus clientes.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 border">
              <h3 className="font-bold text-lg mb-2">Gestão de Inventário</h3>
              <p className="text-muted-foreground">
                Controle seu estoque, defina alertas para itens em baixa quantidade e gerencie fornecedores.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 border">
              <h3 className="font-bold text-lg mb-2">PDV Completo</h3>
              <p className="text-muted-foreground">
                Realize vendas de forma rápida e simples, emita recibos e acompanhe o desempenho do seu negócio.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 border">
              <h3 className="font-bold text-lg mb-2">Cadastro de Clientes</h3>
              <p className="text-muted-foreground">
                Mantenha todos os dados importantes dos seus clientes em um só lugar, incluindo histórico de procedimentos.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 border">
              <h3 className="font-bold text-lg mb-2">Programa de Fidelidade</h3>
              <p className="text-muted-foreground">
                Crie campanhas para fidelizar clientes, ofereça descontos e promoções personalizadas.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 border">
              <h3 className="font-bold text-lg mb-2">Relatórios Detalhados</h3>
              <p className="text-muted-foreground">
                Visualize o desempenho do seu negócio com relatórios intuitivos e dados em tempo real.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" onClick={handleGetStarted} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Comece seu período de teste gratuito'
              )}
            </Button>
            <p className="text-muted-foreground mt-4">
              Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold">PiercerHub</h3>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Termos de Uso
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidade
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Subscription;

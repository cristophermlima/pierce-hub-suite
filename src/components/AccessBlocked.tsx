
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccessBlockedProps {
  title?: string;
  description?: string;
  showSubscriptionButton?: boolean;
}

export function AccessBlocked({ 
  title = "Acesso Bloqueado",
  description = "Seu período de teste expirou. Assine um plano para continuar usando o PiercerHub.",
  showSubscriptionButton = true
}: AccessBlockedProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSubscriptionButton && (
            <Button 
              onClick={() => navigate('/subscription')} 
              className="w-full"
              size="lg"
            >
              <Crown className="mr-2 h-4 w-4" />
              Ver Planos de Assinatura
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')} 
            className="w-full"
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

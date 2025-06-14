
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Beaker, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

export function TrialBanner() {
  const { isTrial, daysRemaining } = useSubscription();
  const navigate = useNavigate();

  return (
    <Alert className="mb-4 lg:mb-6 border-blue-500 bg-blue-50">
      <Beaker className="h-4 w-4" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-sm">
          <strong>Fase de Testes:</strong> Software em desenvolvimento - Teste todas as funcionalidades gratuitamente!
          {isTrial && ` (${daysRemaining} dias do seu período de teste)`}
        </span>
        <Button 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="w-full sm:w-auto"
        >
          <Crown className="mr-1 h-3 w-3" />
          Ver Planos Futuros
        </Button>
      </AlertDescription>
    </Alert>
  );
}

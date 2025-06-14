
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Beaker, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

export function TrialBanner() {
  const { isTrial, daysRemaining } = useSubscription();
  const navigate = useNavigate();

  return (
    <Alert className="mb-4 lg:mb-6 border-2 border-blue-400 bg-blue-900/20 backdrop-blur-sm shadow-lg">
      <Beaker className="h-4 w-4 text-blue-400" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-sm text-blue-100 font-medium">
          <strong className="text-blue-200">Fase de Testes:</strong> Software em desenvolvimento - Teste todas as funcionalidades gratuitamente!
          {isTrial && ` (${daysRemaining} dias do seu período de teste)`}
        </span>
        <Button 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
        >
          <Crown className="mr-1 h-3 w-3" />
          Ver Planos Futuros
        </Button>
      </AlertDescription>
    </Alert>
  );
}

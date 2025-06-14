
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

export function TrialBanner() {
  const { isTrial, daysRemaining, hasActiveAccess } = useSubscription();
  const navigate = useNavigate();

  if (!isTrial || !hasActiveAccess) {
    return null;
  }

  const isExpiringSoon = daysRemaining <= 3;

  return (
    <Alert className={`mb-4 lg:mb-6 ${isExpiringSoon ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50'}`}>
      <Clock className="h-4 w-4" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-sm">
          <strong>Período de teste:</strong> {daysRemaining} dia{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
          {isExpiringSoon && ' - Expire em breve!'}
        </span>
        <Button 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="w-full sm:w-auto"
        >
          <Crown className="mr-1 h-3 w-3" />
          Assinar Agora
        </Button>
      </AlertDescription>
    </Alert>
  );
}

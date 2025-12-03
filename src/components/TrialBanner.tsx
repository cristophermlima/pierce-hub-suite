
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Beaker, Crown } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export function TrialBanner() {
  const { isTrial, daysRemaining } = useSubscription();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Alert className="mb-4 lg:mb-6 border-2 border-primary/30 bg-primary/5 backdrop-blur-sm shadow-md">
      <Beaker className="h-4 w-4 text-primary" />
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-sm text-foreground font-medium">
          <strong className="text-primary">{t('testPhase')}:</strong> {t('testAllFeatures')}
          {isTrial && ` (${daysRemaining} dias do seu período de teste)`}
        </span>
        <Button 
          size="sm" 
          onClick={() => navigate('/subscription')}
          variant="default"
          className="w-full sm:w-auto"
        >
          <Crown className="mr-1 h-3 w-3" />
          {t('viewPlans')}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

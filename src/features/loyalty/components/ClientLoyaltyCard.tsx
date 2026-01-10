import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Gift, Trash2, Star, TrendingUp } from 'lucide-react';
import { ClientLoyalty, useClientLoyalty } from '../hooks/useClientLoyalty';
import { useTranslation } from '@/hooks/useTranslation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ClientLoyaltyCardProps {
  enrollment: ClientLoyalty;
  onRedeemReward?: (enrollment: ClientLoyalty) => void;
}

export function ClientLoyaltyCard({ enrollment, onRedeemReward }: ClientLoyaltyCardProps) {
  const { t } = useTranslation();
  const { unenrollClient, checkEligibility } = useClientLoyalty();
  
  const eligibility = checkEligibility(enrollment);
  const conditions = enrollment.plan?.conditions || {};
  const reward = enrollment.plan?.reward || {};

  // Calcular progresso
  const getProgress = (): { current: number; target: number; percentage: number } => {
    if (conditions.type === 'visits') {
      const current = enrollment.client?.visits || 0;
      const target = conditions.min_visits || 1;
      return { current, target, percentage: Math.min((current / target) * 100, 100) };
    }
    if (conditions.type === 'spending') {
      const current = enrollment.total_spent;
      const target = conditions.min_amount || 1;
      return { current, target, percentage: Math.min((current / target) * 100, 100) };
    }
    if (conditions.type === 'points') {
      const current = enrollment.points;
      const target = conditions.min_points || 1;
      return { current, target, percentage: Math.min((current / target) * 100, 100) };
    }
    return { current: 0, target: 0, percentage: 0 };
  };

  const progress = getProgress();

  const getConditionLabel = () => {
    switch (conditions.type) {
      case 'visits': return `${progress.current}/${progress.target} visitas`;
      case 'spending': return `R$ ${progress.current.toFixed(2)} / R$ ${progress.target}`;
      case 'points': return `${progress.current}/${progress.target} pontos`;
      case 'birthday': return 'Aniversário do mês';
      default: return '';
    }
  };

  const getRewardLabel = () => {
    if (reward.type === 'discount' && reward.discount_percentage) {
      return `${reward.discount_percentage}% de desconto`;
    }
    if (reward.type === 'free_item') {
      return reward.free_item_name || 'Item grátis';
    }
    if (reward.type === 'custom') {
      return reward.custom_description || 'Recompensa especial';
    }
    return 'Recompensa';
  };

  return (
    <Card className={`${eligibility.eligible ? 'border-green-500/50 bg-green-50/30 dark:bg-green-950/20' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{enrollment.client?.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{enrollment.client?.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            {eligibility.eligible && (
              <Badge className="bg-green-500">
                <Gift className="h-3 w-3 mr-1" />
                Elegível
              </Badge>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover do plano?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O cliente perderá todo o progresso acumulado neste plano.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => unenrollClient(enrollment.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Plano */}
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">{enrollment.plan?.name}</span>
        </div>

        {/* Progresso */}
        {conditions.type !== 'birthday' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{getConditionLabel()}</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded p-2">
            <div className="text-lg font-bold">{enrollment.points}</div>
            <div className="text-xs text-muted-foreground">Pontos</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="text-lg font-bold">R$ {Number(enrollment.total_spent).toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">Gastos</div>
          </div>
          <div className="bg-muted/50 rounded p-2">
            <div className="text-lg font-bold">{enrollment.rewards_claimed}</div>
            <div className="text-xs text-muted-foreground">Resgates</div>
          </div>
        </div>

        {/* Recompensa */}
        <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-primary" />
            <span className="text-sm">{getRewardLabel()}</span>
          </div>
          {eligibility.eligible && onRedeemReward && (
            <Button size="sm" onClick={() => onRedeemReward(enrollment)}>
              Resgatar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

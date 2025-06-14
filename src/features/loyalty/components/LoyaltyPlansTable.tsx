import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { LoyaltyPlan } from "../hooks/useLoyaltyPlans";
import { cn } from "@/lib/utils";

interface Props {
  plans: LoyaltyPlan[];
  onEdit: (plan: LoyaltyPlan) => void;
  onDelete: (id: string) => void;
}

export const LoyaltyPlansTable = ({ plans, onEdit, onDelete }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="py-2 text-left">Nome</th>
            <th className="py-2">Status</th>
            <th className="py-2">Recompensa</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {plans.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-muted-foreground">
                Nenhum plano cadastrado.
              </td>
            </tr>
          ) : (
            plans.map(plan => (
              <tr
                key={plan.id}
                className={cn(
                  "border-t cursor-pointer hover:bg-accent transition",
                  !plan.active && "opacity-50"
                )}
                onClick={() => onEdit(plan)}
                tabIndex={0}
                aria-label={`Editar plano ${plan.name}`}
                style={{ userSelect: "none" }}
              >
                <td className="p-2">{plan.name}</td>
                <td className="p-2">
                  {plan.active ? (
                    <Badge variant="default">Ativo</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted">Inativo</Badge>
                  )}
                </td>
                <td className="p-2">
                  {plan.reward && typeof plan.reward === "object" ? (
                    <span>
                      {plan.reward.type === "discount" 
                        ? `${plan.reward.value}${plan.reward.unit}` 
                        : plan.reward.type}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    onClick={e => { e.stopPropagation(); onDelete(plan.id); }}
                    aria-label="Excluir plano"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

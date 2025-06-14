
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
    <div className="overflow-x-auto bg-neutral-900 border border-neutral-700 rounded-lg">
      <table className="w-full text-sm text-white">
        <thead>
          <tr className="border-b border-neutral-700">
            <th className="py-3 px-4 text-left text-neutral-300">Nome</th>
            <th className="py-3 px-4 text-center text-neutral-300">Status</th>
            <th className="py-3 px-4 text-center text-neutral-300">Recompensa</th>
            <th className="py-3 px-4 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {plans.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-8 text-neutral-400">
                Nenhum plano cadastrado.
              </td>
            </tr>
          ) : (
            plans.map(plan => (
              <tr
                key={plan.id}
                className={cn(
                  "border-b border-neutral-800 cursor-pointer hover:bg-neutral-800 transition-colors",
                  !plan.active && "opacity-50"
                )}
                onClick={() => onEdit(plan)}
                tabIndex={0}
                aria-label={`Editar plano ${plan.name}`}
                style={{ userSelect: "none" }}
              >
                <td className="p-4 text-white font-medium">{plan.name}</td>
                <td className="p-4 text-center">
                  {plan.active ? (
                    <Badge variant="default" className="bg-green-900 text-green-300 border-green-700">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-neutral-800 text-neutral-400 border-neutral-600">
                      Inativo
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-center text-neutral-300">
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
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    onClick={e => { e.stopPropagation(); onDelete(plan.id); }}
                    aria-label="Excluir plano"
                    className="text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
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

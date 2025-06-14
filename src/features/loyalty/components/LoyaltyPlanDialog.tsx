import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoyaltyPlan } from "../hooks/useLoyaltyPlans";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const rewardTypeOptions = [
  { value: "discount", label: "Desconto" },
  // Acrescente mais tipos se quiser no futuro
];

const rewardUnitOptions = [
  { value: "%", label: "Porcentagem (%)" },
  { value: "R$", label: "Valor em Reais (R$)" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<LoyaltyPlan>) => void;
  loading?: boolean;
  defaultValues?: Partial<LoyaltyPlan> | null; // Accept both undefined and null
}

export const LoyaltyPlanDialog = ({
  open,
  onOpenChange,
  onSave,
  loading = false,
  defaultValues
}: Props) => {
  const safeDefaults = defaultValues || {};
  const [name, setName] = useState(safeDefaults.name || "");
  const [description, setDescription] = useState(safeDefaults.description || "");
  const [active, setActive] = useState(safeDefaults.active ?? true);

  // Simplificando a estrutura para o usuário.
  const defaultReward = typeof safeDefaults.reward === "object" && safeDefaults.reward
    ? safeDefaults.reward
    : { type: "discount", value: "", unit: "%" };
  const [rewardType, setRewardType] = useState(defaultReward.type || "discount");
  const [rewardValue, setRewardValue] = useState(
    defaultReward.value !== undefined && defaultReward.value !== null
      ? String(defaultReward.value)
      : ""
  );
  const [rewardUnit, setRewardUnit] = useState(defaultReward.unit || "%");

  // Condição: número de visitas mínimas
  let visitsCond = "";
  if (Array.isArray(safeDefaults.conditions) && safeDefaults.conditions[0] && safeDefaults.conditions[0].field === "visits") {
    visitsCond = String(safeDefaults.conditions[0].value);
  }
  const [minVisits, setMinVisits] = useState(visitsCond);

  useEffect(() => {
    setName(safeDefaults.name || "");
    setDescription(safeDefaults.description || "");
    setActive(typeof safeDefaults.active === "boolean" ? safeDefaults.active : true);
    const rewardObj = typeof safeDefaults.reward === "object" && safeDefaults.reward
      ? safeDefaults.reward
      : { type: "discount", value: "", unit: "%" };
    setRewardType(rewardObj.type || "discount");
    setRewardValue(
      rewardObj.value !== undefined && rewardObj.value !== null
        ? String(rewardObj.value)
        : ""
    );
    setRewardUnit(rewardObj.unit || "%");
    if (
      Array.isArray(safeDefaults.conditions) &&
      safeDefaults.conditions[0] &&
      safeDefaults.conditions[0].field === "visits"
    ) {
      setMinVisits(String(safeDefaults.conditions[0].value));
    } else {
      setMinVisits("");
    }
  }, [open, defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reward = {
      type: rewardType,
      value: Number(rewardValue),
      unit: rewardUnit,
    };

    const conditions =
      minVisits
        ? [
            {
              field: "visits",
              operator: ">=",
              value: Number(minVisits),
            },
          ]
        : [];

    onSave({
      name: name.trim(),
      description: description.trim(),
      active,
      reward,
      conditions,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{safeDefaults.id ? "Editar Plano" : "Novo Plano"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          {/* Campo Descrição removido para simplificar caso não use */}
          <div className="flex items-center gap-2">
            <Switch checked={active} onCheckedChange={setActive} id="status" />
            <Label htmlFor="status">Ativo</Label>
          </div>
          <div>
            <Label>Tipo de Recompensa</Label>
            <Select value={rewardType} onValueChange={setRewardType}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {rewardTypeOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Valor</Label>
              <Input
                type="number"
                min="0"
                value={rewardValue}
                onChange={e => setRewardValue(e.target.value)}
                required
                placeholder="Ex: 10"
              />
            </div>
            <div className="flex-1">
              <Label>Unidade</Label>
              <Select value={rewardUnit} onValueChange={setRewardUnit}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Escolha a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {rewardUnitOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Mínimo de visitas para ganhar</Label>
            <Input
              type="number"
              min="1"
              value={minVisits}
              onChange={e => setMinVisits(e.target.value)}
              placeholder="Ex: 5"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

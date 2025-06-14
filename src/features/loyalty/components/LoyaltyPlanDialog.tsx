
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LoyaltyPlan } from "../hooks/useLoyaltyPlans";

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
  // Defensive: fallback to {} if null or undefined
  const safeDefaults = defaultValues || {};
  const [name, setName] = useState(safeDefaults.name || "");
  const [description, setDescription] = useState(safeDefaults.description || "");
  const [active, setActive] = useState(safeDefaults.active ?? true);
  const [reward, setReward] = useState(safeDefaults.reward ? JSON.stringify(safeDefaults.reward) : "");
  const [conditions, setConditions] = useState(safeDefaults.conditions ? JSON.stringify(safeDefaults.conditions) : "");

  React.useEffect(() => {
    setName((defaultValues && defaultValues.name) || "");
    setDescription((defaultValues && defaultValues.description) || "");
    setActive(defaultValues && typeof defaultValues.active === "boolean" ? defaultValues.active : true);
    setReward(defaultValues && defaultValues.reward ? JSON.stringify(defaultValues.reward) : "");
    setConditions(defaultValues && defaultValues.conditions ? JSON.stringify(defaultValues.conditions) : "");
  }, [defaultValues, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let rewardJson = null, condJson = null;
    try {
      if (reward) rewardJson = JSON.parse(reward);
    } catch { rewardJson = reward; }
    try {
      if (conditions) condJson = JSON.parse(conditions);
    } catch { condJson = conditions; }
    onSave({
      name,
      description,
      active,
      reward: rewardJson,
      conditions: condJson,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{safeDefaults.id ? "Editar Plano" : "Novo Plano"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <Label>Nome</Label>
          <Input value={name} onChange={e => setName(e.target.value)} required />
          <Label>Descrição</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          <div className="flex items-center gap-2">
            <Switch checked={active} onCheckedChange={setActive} id="status" />
            <Label htmlFor="status">Ativo</Label>
          </div>
          <Label>Recompensa (JSON)</Label>
          <Input value={reward} onChange={e => setReward(e.target.value)} placeholder='Ex: {"type":"discount", "value":15, "unit":"%"}' />
          <Label>Condições (JSON)</Label>
          <Input value={conditions} onChange={e => setConditions(e.target.value)} placeholder='Ex: [{"field":"visits", "operator":">=", "value":5}]' />
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

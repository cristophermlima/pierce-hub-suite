
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useProcedureMaterials } from "../hooks/useProcedureMaterials";

interface ProcedureCostItem {
  material_id: string;
  material_name: string;
  quantity_used: number;
  cost_per_unit: number;
  total_cost: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCosts: (costs: ProcedureCostItem[], notes: string) => void;
}

export const ProcedureCostsDialog = ({ open, onOpenChange, onSaveCosts }: Props) => {
  const { materials } = useProcedureMaterials();
  const [costs, setCosts] = useState<ProcedureCostItem[]>([]);
  const [notes, setNotes] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState(0);

  const addMaterialCost = () => {
    const material = materials.find(m => m.id === selectedMaterial);
    if (!material || quantity <= 0) return;

    const totalCost = quantity * material.unit_cost;
    const newCost: ProcedureCostItem = {
      material_id: material.id,
      material_name: material.name,
      quantity_used: quantity,
      cost_per_unit: material.unit_cost,
      total_cost: totalCost
    };

    setCosts(prev => [...prev, newCost]);
    setSelectedMaterial("");
    setQuantity(0);
  };

  const removeCost = (index: number) => {
    setCosts(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSaveCosts(costs, notes);
    setCosts([]);
    setNotes("");
    onOpenChange(false);
  };

  const totalProcedureCost = costs.reduce((sum, cost) => sum + cost.total_cost, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Custos do Procedimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Adicionar material */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Adicionar Material Usado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Material</Label>
                <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map(material => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} - {formatCurrency(material.unit_cost)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantidade Usada</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={addMaterialCost} 
                  disabled={!selectedMaterial || quantity <= 0}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de custos */}
          <div>
            <h3 className="font-medium mb-4">Materiais Utilizados</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Custo Unitário</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead className="w-16">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum material adicionado
                      </TableCell>
                    </TableRow>
                  ) : (
                    costs.map((cost, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{cost.material_name}</TableCell>
                        <TableCell>{cost.quantity_used}</TableCell>
                        <TableCell>{formatCurrency(cost.cost_per_unit)}</TableCell>
                        <TableCell>{formatCurrency(cost.total_cost)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCost(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {costs.length > 0 && (
                    <TableRow className="font-bold">
                      <TableCell colSpan={3}>Total do Procedimento:</TableCell>
                      <TableCell>{formatCurrency(totalProcedureCost)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label>Observações do Procedimento</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o procedimento realizado..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Custos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

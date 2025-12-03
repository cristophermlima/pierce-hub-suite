
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";
import { useProcedureMaterials, ProcedureMaterial } from "../hooks/useProcedureMaterials";
import { useAppSettings } from "@/context/AppSettingsContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const unitTypeLabels = {
  unit: 'Unidade',
  ml: 'Mililitro (ml)',
  gr: 'Grama (gr)',
  cm: 'Centímetro (cm)'
};

const currencyLabels = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
};

export const ProcedureMaterialsDialog = ({ open, onOpenChange }: Props) => {
  const { materials, createMaterial, updateMaterial, deleteMaterial, isCreating } = useProcedureMaterials();
  const { formatCurrency, currency } = useAppSettings();
  const currencyLabel = currencyLabels[currency];
  
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    unit_type: 'unit' as const,
    total_quantity: 0,
    unit_cost: 0
  });

  const handleCreateMaterial = () => {
    if (!newMaterial.name.trim()) return;
    
    createMaterial(newMaterial);
    setNewMaterial({
      name: '',
      unit_type: 'unit',
      total_quantity: 0,
      unit_cost: 0
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Materiais de Procedimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário para adicionar novo material */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Adicionar Novo Material</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Nome do Material</Label>
                <Input
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Agulha 14G"
                />
              </div>
              <div>
                <Label>Tipo de Unidade</Label>
                <Select 
                  value={newMaterial.unit_type}
                  onValueChange={(value: any) => setNewMaterial(prev => ({ ...prev, unit_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(unitTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantidade Total</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newMaterial.total_quantity}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, total_quantity: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Custo Unitário ({currencyLabel})</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newMaterial.unit_cost}
                  onChange={(e) => setNewMaterial(prev => ({ ...prev, unit_cost: Number(e.target.value) }))}
                />
              </div>
            </div>
            <Button onClick={handleCreateMaterial} disabled={isCreating || !newMaterial.name.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Material
            </Button>
          </div>

          {/* Lista de materiais existentes */}
          <div>
            <h3 className="font-medium mb-4">Materiais Cadastrados</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Quantidade Total</TableHead>
                    <TableHead>Custo Unitário</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead className="w-16">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum material cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>{unitTypeLabels[material.unit_type]}</TableCell>
                        <TableCell>{material.total_quantity}</TableCell>
                        <TableCell>{formatCurrency(material.unit_cost)}</TableCell>
                        <TableCell>{formatCurrency(material.total_quantity * material.unit_cost)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMaterial(material.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

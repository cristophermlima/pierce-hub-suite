
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SterilizedMaterial } from '../types';

interface SterilizedMaterialsTableProps {
  materials: SterilizedMaterial[];
  onEdit: (material: SterilizedMaterial) => void;
  onDelete: (id: string) => void;
  onUse: (params: { id: string; quantityUsed: number }) => void;
}

export function SterilizedMaterialsTable({
  materials,
  onEdit,
  onDelete,
  onUse
}: SterilizedMaterialsTableProps) {
  const [useDialogOpen, setUseDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<SterilizedMaterial | null>(null);
  const [quantityToUse, setQuantityToUse] = useState(1);

  const handleUseClick = (material: SterilizedMaterial) => {
    setSelectedMaterial(material);
    setQuantityToUse(1);
    setUseDialogOpen(true);
  };

  const handleConfirmUse = () => {
    if (selectedMaterial && quantityToUse > 0) {
      onUse({ id: selectedMaterial.id, quantityUsed: quantityToUse });
      setUseDialogOpen(false);
      setSelectedMaterial(null);
      setQuantityToUse(1);
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      kit: 'default',
      tool: 'secondary',
      other: 'outline'
    } as const;
    
    const labels = {
      kit: 'Kit',
      tool: 'Ferramenta',
      other: 'Outro'
    };

    return (
      <Badge variant={variants[category as keyof typeof variants] || 'outline'}>
        {labels[category as keyof typeof labels] || category}
      </Badge>
    );
  };

  const getExpirationStatus = (expirationDate: string, isExpired: boolean) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isExpired) {
      return <Badge variant="destructive">Vencido</Badge>;
    } else if (diffDays <= 7) {
      return <Badge variant="destructive">Vence em {diffDays} dias</Badge>;
    } else if (diffDays <= 30) {
      return <Badge variant="secondary">Vence em {diffDays} dias</Badge>;
    } else {
      return <Badge variant="default">Válido</Badge>;
    }
  };

  if (materials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum material esterilizado encontrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Estéril</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>{getCategoryBadge(material.category)}</TableCell>
                <TableCell>{material.quantity_sterile}</TableCell>
                <TableCell>{material.total_quantity}</TableCell>
                <TableCell>{material.sterilization_method}</TableCell>
                <TableCell>
                  {new Date(material.expiration_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {getExpirationStatus(material.expiration_date, material.is_expired)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {material.quantity_sterile > 0 && !material.is_expired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUseClick(material)}
                        title="Usar material"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(material)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={useDialogOpen} onOpenChange={setUseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usar Material Esterilizado</DialogTitle>
          </DialogHeader>
          
          {selectedMaterial && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedMaterial.name}</p>
                <p className="text-sm text-muted-foreground">
                  Disponível: {selectedMaterial.quantity_sterile} unidades
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade a usar</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedMaterial.quantity_sterile}
                  value={quantityToUse}
                  onChange={(e) => setQuantityToUse(Number(e.target.value))}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setUseDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmUse}
                  disabled={quantityToUse <= 0 || quantityToUse > selectedMaterial.quantity_sterile}
                >
                  Confirmar Uso
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

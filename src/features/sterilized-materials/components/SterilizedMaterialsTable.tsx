
import React from 'react';
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
import { Edit, Trash2, Minus, AlertTriangle } from 'lucide-react';
import { SterilizedMaterial } from '../types';

interface SterilizedMaterialsTableProps {
  materials: SterilizedMaterial[];
  onEdit: (material: SterilizedMaterial) => void;
  onDelete: (id: string) => void;
  onUse: (id: string, quantity: number) => void;
}

export function SterilizedMaterialsTable({
  materials,
  onEdit,
  onDelete,
  onUse
}: SterilizedMaterialsTableProps) {
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
      <Badge variant={variants[category as keyof typeof variants]}>
        {labels[category as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusBadge = (material: SterilizedMaterial) => {
    if (material.is_expired) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    
    const daysToExpiry = Math.ceil(
      (new Date(material.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysToExpiry <= 7) {
      return <Badge variant="secondary">Expira em {daysToExpiry} dias</Badge>;
    }
    
    if (material.quantity_sterile === 0) {
      return <Badge variant="outline">Sem estoque</Badge>;
    }
    
    return <Badge variant="default">Disponível</Badge>;
  };

  if (materials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum material encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Esterilização</TableHead>
            <TableHead>Validade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{material.name}</div>
                  {material.batch_number && (
                    <div className="text-sm text-muted-foreground">
                      Lote: {material.batch_number}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{getCategoryBadge(material.category)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {material.quantity_sterile}/{material.total_quantity}
                  {material.quantity_sterile === 0 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div>{new Date(material.sterilization_date).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {material.sterilization_method}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {new Date(material.expiration_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{getStatusBadge(material)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUse(material.id, 1)}
                    disabled={material.quantity_sterile === 0 || material.is_expired}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
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
  );
}


import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Trash2 } from "lucide-react";
import { Supplier } from '../types';

interface SuppliersTableProps {
  suppliers: Supplier[];
  onEditSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
  isDeleting: boolean;
}

export const SuppliersTable = ({ 
  suppliers, 
  onEditSupplier, 
  onDeleteSupplier, 
  isDeleting 
}: SuppliersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Empresa</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Contatos</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.map(supplier => (
          <TableRow key={supplier.id}>
            <TableCell className="font-medium">{supplier.name}</TableCell>
            <TableCell>{supplier.contact_name}</TableCell>
            <TableCell>{supplier.category}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" title={supplier.phone}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title={supplier.email}>
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEditSupplier(supplier)}>
                  Detalhes
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteSupplier(supplier.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

interface SuppliersHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewSupplier: () => void;
}

export const SuppliersHeader = ({ searchQuery, onSearchChange, onNewSupplier }: SuppliersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar fornecedores..."
          className="w-full pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onNewSupplier}>
        <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
      </Button>
    </div>
  );
};


import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail } from "lucide-react";

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const suppliers = [
    { id: 1, name: 'Piercing Brasil', contact: 'Roberto Souza', phone: '(11) 98765-4321', email: 'contato@piercingbrasil.com.br', category: 'Joias' },
    { id: 2, name: 'Medical Supply Co.', contact: 'Carla Oliveira', phone: '(21) 99876-5432', email: 'vendas@medicalsupply.com.br', category: 'Equipamentos' },
    { id: 3, name: 'Steril Tech', contact: 'Paulo Mendes', phone: '(31) 97654-3210', email: 'paulo@steriltech.com.br', category: 'Esterilização' },
    { id: 4, name: 'Body Art Imports', contact: 'Fernanda Lima', phone: '(41) 96543-2109', email: 'comercial@bodyartimports.com.br', category: 'Joias Importadas' },
    { id: 5, name: 'Clean & Safe', contact: 'Ricardo Gomes', phone: '(51) 95432-1098', email: 'atendimento@cleansafe.com.br', category: 'Produtos de Limpeza' },
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar fornecedores..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fornecedores</CardTitle>
          <CardDescription>Gerencie seus fornecedores e parceiros</CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredSuppliers.map(supplier => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
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
                    <Button variant="outline" size="sm">Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Suppliers;

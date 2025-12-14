
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Eye } from 'lucide-react';
import { Client } from '../types';
import { useToast } from '@/components/ui/use-toast';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onSendForm: (client: Client) => void;
  onViewAnamnesis: (client: Client) => void;
}

export const ClientList = ({ clients, onEdit, onDelete, onSendForm, onViewAnamnesis }: ClientListProps) => {
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Atendimentos</TableHead>
            <TableHead>Último Atendimento</TableHead>
            <TableHead className="w-[180px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.visits}</TableCell>
                <TableCell>
                  {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString('pt-BR') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                     <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onSendForm(client)}
                    >
                      Gerar Link
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onViewAnamnesis(client)}
                      title="Visualizar Anamnese"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(client)}
                      title="Editar Cliente"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(client)}
                      title="Excluir Cliente"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

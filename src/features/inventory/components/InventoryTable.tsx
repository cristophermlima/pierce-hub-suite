
import { InventoryItem } from '../types';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface InventoryTableProps {
  items: InventoryItem[];
  onEditItem: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onEditItem }: InventoryTableProps) {
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Estoque</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length > 0 ? (
            items.map((item) => {
              const isLowStock = item.stock < item.threshold && !item.is_service;
              const stockClass = isLowStock ? 'text-red-500 font-semibold' : '';
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell className={`text-right ${stockClass}`}>
                    {item.is_service ? '—' : item.stock}
                  </TableCell>
                  <TableCell className="text-right">
                    R$ {item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.is_service ? (
                      <span className="bg-blue-500/20 text-blue-600 text-xs px-2 py-1 rounded-full">
                        Serviço
                      </span>
                    ) : isLowStock ? (
                      <span className="bg-red-500/20 text-red-600 text-xs px-2 py-1 rounded-full">
                        Estoque Baixo
                      </span>
                    ) : (
                      <span className="bg-green-500/20 text-green-600 text-xs px-2 py-1 rounded-full">
                        Em Estoque
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditItem(item)}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum item de inventário encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '../types';

interface InventoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
  onAddItem: () => void;
}

export function InventoryFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  categories,
  onAddItem
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="relative w-full sm:w-72">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input 
            placeholder="Buscar inventário..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select 
          value={filterCategory} 
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas as Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={onAddItem}>
        <Plus size={18} className="mr-2" />
        Adicionar Item
      </Button>
    </div>
  );
}

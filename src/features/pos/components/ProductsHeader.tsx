
import React from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Gem, Scissors, Wrench, Heart, Package } from 'lucide-react';

interface ProductsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const ProductsHeader = ({ 
  searchQuery, 
  onSearchChange, 
  selectedTab, 
  onTabChange 
}: ProductsHeaderProps) => {
  return (
    <div className="space-y-4 p-4 bg-white border-b border-gray-200">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Abas de categorias */}
      <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Todos
          </TabsTrigger>
          <TabsTrigger value="jewelry" className="flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Joias
          </TabsTrigger>
          <TabsTrigger value="care" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Cuidados
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="accessories" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Acessórios
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProductsHeader;

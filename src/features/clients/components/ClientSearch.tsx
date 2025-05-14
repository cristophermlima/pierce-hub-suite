
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ClientSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const ClientSearch = ({ searchTerm, setSearchTerm }: ClientSearchProps) => {
  return (
    <div className="relative w-full sm:w-72">
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input 
        placeholder="Buscar clientes..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

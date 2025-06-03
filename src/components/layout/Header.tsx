
import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import UserMenu from '@/components/auth/UserMenu';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}

const Header = ({ title, toggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 font-medium">Notificações</div>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="font-medium">Estoque baixo: Barbell 16G</div>
              <div className="text-xs text-muted-foreground">O estoque está abaixo do nível mínimo</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="font-medium">Lembrete de agendamento</div>
              <div className="text-xs text-muted-foreground">Ana Silva tem agendamento às 14:00</div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
              <div className="font-medium">Pontos de fidelidade</div>
              <div className="text-xs text-muted-foreground">Carlos Oliveira atingiu 100 pontos!</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;

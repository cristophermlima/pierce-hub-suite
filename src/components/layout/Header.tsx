
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
import { WhatsAppSupport } from './WhatsAppSupport';
import { useHeaderNotifications } from '@/hooks/useHeaderNotifications';

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}

const Header = ({ title, toggleSidebar }: HeaderProps) => {
  const { data: notifications = [] } = useHeaderNotifications();

  return (
    <header className="bg-background border-b border-border min-h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 pt-safe">
      <div className="flex items-center gap-4 min-w-0">
        <Button 
          variant="ghost" 
          size="icon"
          className="lg:hidden flex-shrink-0"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-lg lg:text-xl font-semibold truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
        <WhatsAppSupport variant="header" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-background border shadow-lg">
            <div className="p-2 font-medium border-b">Notificações</div>
            {notifications.length === 0 ? (
              <DropdownMenuItem className="flex flex-col items-center p-4 text-muted-foreground">
                Nenhuma notificação no momento
              </DropdownMenuItem>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.description}</div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;

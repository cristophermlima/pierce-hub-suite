
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Package, 
  BarChart, 
  Settings, 
  X,
  LogOut,
  Truck,
  Gift,
  ShoppingBag,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ to, icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn("sidebar-item", active && "active")}
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
};

interface SidebarProps {
  isMobileOpen: boolean;
  closeMobileMenu: () => void;
}

const Sidebar = ({ isMobileOpen, closeMobileMenu }: SidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado com sucesso",
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      <div 
        className={cn(
          "h-screen bg-card fixed left-0 top-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-border",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col justify-between p-4">
          <div className="flex-1 min-h-0">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-2">
                <img src={logo} alt="PiercerHub" className="h-8 w-auto" />
                <h1 className="text-xl lg:text-2xl font-bold text-foreground truncate">PiercerHub</h1>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden flex-shrink-0" 
                onClick={closeMobileMenu}
              >
                <X size={20} />
              </Button>
            </div>

            <nav className="space-y-1 overflow-y-auto">
              <SidebarItem 
                to="/" 
                icon={<Home size={18} />} 
                label="Dashboard" 
                active={isActive("/")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/clients" 
                icon={<Users size={18} />} 
                label="Clientes" 
                active={isActive("/clients")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/appointments" 
                icon={<Calendar size={18} />} 
                label="Agendamentos" 
                active={isActive("/appointments")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/inventory" 
                icon={<Package size={18} />} 
                label="Inventário" 
                active={isActive("/inventory")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/suppliers" 
                icon={<Truck size={18} />} 
                label="Fornecedores" 
                active={isActive("/suppliers")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/loyalty" 
                icon={<Gift size={18} />} 
                label="Fidelidade" 
                active={isActive("/loyalty")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/pos" 
                icon={<ShoppingBag size={18} />} 
                label="PDV" 
                active={isActive("/pos")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/notifications" 
                icon={<Bell size={18} />} 
                label="Notificações" 
                active={isActive("/notifications")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/reports" 
                icon={<BarChart size={18} />} 
                label="Relatórios" 
                active={isActive("/reports")}
                onClick={closeMobileMenu}
              />
              <SidebarItem 
                to="/settings" 
                icon={<Settings size={18} />} 
                label="Configurações" 
                active={isActive("/settings")}
                onClick={closeMobileMenu}
              />
            </nav>
          </div>

          <Button 
            variant="ghost" 
            className="sidebar-item w-full justify-start mt-4"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="truncate">Sair</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

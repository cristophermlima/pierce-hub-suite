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
  Bell,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useTeamContext, TeamPermissions } from '@/hooks/useTeamContext';
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

// Mapeamento de rotas para permissões
const routePermissions: Record<string, keyof TeamPermissions | null> = {
  '/': null, // Dashboard sempre visível
  '/clients': 'clients',
  '/appointments': 'appointments',
  '/inventory': 'inventory',
  '/catalogs': 'inventory',
  '/suppliers': 'inventory',
  '/loyalty': 'clients',
  '/pos': 'pos',
  '/notifications': null, // Sempre visível
  '/reports': 'reports',
  '/settings': 'settings',
};

const Sidebar = ({ isMobileOpen, closeMobileMenu }: SidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { permissions, isOwner } = useTeamContext();
  
  const handleLogout = () => {
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado com sucesso",
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const canAccess = (path: string): boolean => {
    if (isOwner) return true;
    const permission = routePermissions[path];
    if (permission === null) return true;
    return permissions[permission] === true;
  };

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
          "h-[100dvh] bg-card fixed left-0 top-0 z-40 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-border",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col justify-between p-4 pt-safe pb-safe">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex flex-col items-center gap-1">
                <img src={logo} alt="PiercerHub" className="h-10 w-auto" />
                <span className="text-xs font-bold text-muted-foreground">ERP</span>
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
                label={t('dashboard')} 
                active={isActive("/")}
                onClick={closeMobileMenu}
              />
              {canAccess('/clients') && (
                <SidebarItem 
                  to="/clients" 
                  icon={<Users size={18} />} 
                  label={t('clients')} 
                  active={isActive("/clients")}
                  onClick={closeMobileMenu}
                />
              )}
              {canAccess('/appointments') && (
                <SidebarItem 
                  to="/appointments" 
                  icon={<Calendar size={18} />} 
                  label={t('appointments')} 
                  active={isActive("/appointments")}
                  onClick={closeMobileMenu}
                />
              )}
              {canAccess('/inventory') && (
                <SidebarItem 
                  to="/inventory" 
                  icon={<Package size={18} />} 
                  label={t('inventory')} 
                  active={isActive("/inventory")}
                  onClick={closeMobileMenu}
                />
              )}
              {canAccess('/catalogs') && (
                <SidebarItem 
                  to="/catalogs" 
                  icon={<BookOpen size={18} />} 
                  label="Catálogos" 
                  active={isActive("/catalogs")}
                  onClick={closeMobileMenu}
                />
              )}
              {canAccess('/suppliers') && (
                <SidebarItem 
                  to="/suppliers" 
                  icon={<Truck size={18} />} 
                  label={t('suppliers')} 
                  active={isActive("/suppliers")}
                  onClick={closeMobileMenu}
                />
              )}
              {canAccess('/loyalty') && (
                <SidebarItem 
                  to="/loyalty" 
                  icon={<Gift size={18} />} 
                  label={t('loyalty')} 
                  active={isActive("/loyalty")}
                  onClick={closeMobileMenu}
                />
              )}
              {canAccess('/pos') && (
                <SidebarItem 
                  to="/pos" 
                  icon={<ShoppingBag size={18} />} 
                  label={t('pos')} 
                  active={isActive("/pos")}
                  onClick={closeMobileMenu}
                />
              )}
              <SidebarItem 
                to="/notifications" 
                icon={<Bell size={18} />} 
                label={t('notifications')} 
                active={isActive("/notifications")}
                onClick={closeMobileMenu}
              />
              {canAccess('/reports') && (
                <SidebarItem 
                  to="/reports" 
                  icon={<BarChart size={18} />} 
                  label={t('reports')} 
                  active={isActive("/reports")}
                  onClick={closeMobileMenu}
                />
              )}
              {canAccess('/settings') && (
                <SidebarItem 
                  to="/settings" 
                  icon={<Settings size={18} />} 
                  label={t('settings')} 
                  active={isActive("/settings")}
                  onClick={closeMobileMenu}
                />
              )}
            </nav>
          </div>

          <Button 
            variant="ghost" 
            className="sidebar-item w-full justify-start mt-4"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="truncate">{t('logout')}</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  Package, 
  BarChart, 
  Settings, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ to, icon, label, active }: SidebarItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn("sidebar-item", active && "active")}
    >
      {icon}
      <span>{label}</span>
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
      title: "Logout successful",
      description: "You have been logged out successfully",
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={cn(
        "h-screen bg-card fixed left-0 top-0 z-40 w-64 transform transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="h-full flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <h1 className="text-2xl font-bold text-primary">PiercerHub</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={closeMobileMenu}
            >
              <X size={20} />
            </Button>
          </div>

          <nav className="space-y-1">
            <SidebarItem 
              to="/" 
              icon={<Home size={18} />} 
              label="Dashboard" 
              active={isActive("/")}
            />
            <SidebarItem 
              to="/clients" 
              icon={<Users size={18} />} 
              label="Clients" 
              active={isActive("/clients")}
            />
            <SidebarItem 
              to="/appointments" 
              icon={<Calendar size={18} />} 
              label="Appointments" 
              active={isActive("/appointments")}
            />
            <SidebarItem 
              to="/inventory" 
              icon={<Package size={18} />} 
              label="Inventory" 
              active={isActive("/inventory")}
            />
            <SidebarItem 
              to="/reports" 
              icon={<BarChart size={18} />} 
              label="Reports" 
              active={isActive("/reports")}
            />
            <SidebarItem 
              to="/settings" 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={isActive("/settings")}
            />
          </nav>
        </div>

        <Button 
          variant="ghost" 
          className="sidebar-item w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

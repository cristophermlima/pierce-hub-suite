
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/auth/UserMenu';
import { Menu, X, BarChart3, Users, Settings, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Items de navegação
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <BarChart3 size={20} /> },
    { name: 'Usuários', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Configurações', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <Link to="/admin" className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">PiercerHub Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <UserMenu />
          </div>
        </div>
      </header>
      
      {/* Conteúdo principal */}
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-20 mt-14 w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {React.cloneElement(item.icon, {
                      className: "mr-3 h-5 w-5",
                    })}
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors hover:bg-muted mt-8"
              >
                <span>← Voltar para o App</span>
              </Link>
            </nav>
            <div className="mt-auto px-6 py-4 text-sm">
              <p className="text-muted-foreground">
                PiercerHub Admin v1.0
              </p>
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ease-in-out md:ml-64`}
        >
          {user ? <Outlet /> : <div>Carregando...</div>}
        </main>
      </div>

      {/* Overlay para fechar menu ao clicar fora */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-30 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;

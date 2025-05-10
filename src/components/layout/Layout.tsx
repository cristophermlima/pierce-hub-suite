
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeSidebar = () => {
    setIsMobileOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/clients':
        return 'Clients';
      case '/appointments':
        return 'Appointments';
      case '/inventory':
        return 'Inventory';
      case '/reports':
        return 'Reports';
      case '/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar isMobileOpen={isMobileOpen} closeMobileMenu={closeSidebar} />
      <div className="lg:ml-64">
        <Header title={getPageTitle()} toggleSidebar={toggleSidebar} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay to close sidebar on mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default Layout;

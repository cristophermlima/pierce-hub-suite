
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { TrialBanner } from "@/components/TrialBanner";

const getPageTitle = (pathname: string): string => {
  if (pathname === "/") return "Dashboard";
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment) return "Dashboard";
  // Capitaliza e remove traços
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Layout = () => {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar isMobileOpen={isMobileOpen} closeMobileMenu={closeMobileMenu} />
      <div className="flex-1 flex flex-col">
        <Header title={title} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">
          <TrialBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <main className="lg:ml-[240px] pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
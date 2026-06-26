import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
  role: 'staff' | 'hod' | 'principal' | 'admin';
  user: { name: string; role: string; dept?: string };
  title: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, user, title, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(m => !m);
  const toggleDesktopMenu = () => setCollapsed(c => !c);

  return (
    <div className="app-root flex h-screen overflow-hidden relative">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          role={role}
          user={user}
          collapsed={false}
          onToggle={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full z-10">
        <Sidebar
          role={role}
          user={user}
          collapsed={collapsed}
          onToggle={toggleDesktopMenu}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-0">
        <TopBar
          title={title}
          user={user}
          onMenuToggle={() => {
            // If on mobile (window innerWidth < 768), toggle mobile menu
            if (window.innerWidth < 768) {
              toggleMobileMenu();
            } else {
              toggleDesktopMenu();
            }
          }}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

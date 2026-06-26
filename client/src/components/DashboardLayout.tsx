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

  return (
    <div className="app-root flex h-screen overflow-hidden">
      {/* Sidebar — hidden on mobile, shown on md+ */}
      <div className="hidden md:flex h-full">
        <Sidebar
          role={role}
          user={user}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          title={title}
          user={user}
          onMenuToggle={() => setCollapsed(c => !c)}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[rgba(18,35,36,0.95)] backdrop-blur-[16px] border-t border-[rgba(219,159,117,0.12)] flex items-center justify-around z-40 px-4">
        {/* Minimal bottom nav icons — extend as needed */}
        <span className="text-[#7A6F65] text-[10px] font-medium text-center">Navigation<br/>available on desktop</span>
      </nav>
    </div>
  );
};

export default DashboardLayout;

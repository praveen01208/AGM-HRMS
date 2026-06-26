import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarPlus,
  ClipboardList,
  RefreshCcw,
  History,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,

} from 'lucide-react';
import logo from '../assets/logo.png';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarProps {
  role: 'staff' | 'hod' | 'principal' | 'admin';
  user: { name: string; dept?: string; role: string };
  collapsed?: boolean;
  onToggle?: () => void;
}

const navItemsByRole: Record<string, NavItem[]> = {
  staff: [
    { label: 'Dashboard',    icon: LayoutDashboard, path: '/staff/dashboard' },
    { label: 'Apply Leave',  icon: CalendarPlus,    path: '/staff/leave/apply' },
    { label: 'Leave Status', icon: ClipboardList,   path: '/staff/leave/status' },
    { label: 'History',      icon: History,         path: '/staff/leave/history' },
    { label: 'Adjustments',  icon: RefreshCcw,      path: '/staff/adjustment/respond' },
    { label: 'Profile',      icon: UserCircle,      path: '/staff/profile' },
  ],
  hod: [
    { label: 'Dashboard',    icon: LayoutDashboard, path: '/hod/dashboard' },
    { label: 'Approvals',    icon: ClipboardList,   path: '/hod/leaves' },
    { label: 'Profile',      icon: UserCircle,      path: '/hod/profile' },
  ],
  principal: [
    { label: 'Dashboard',    icon: LayoutDashboard, path: '/principal/dashboard' },
    { label: 'Approvals',    icon: ClipboardList,   path: '/principal/leaves' },
    { label: 'Reports',      icon: History,         path: '/principal/reports' },
    { label: 'Profile',      icon: UserCircle,      path: '/principal/profile' },
  ],
  admin: [
    { label: 'Dashboard',    icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Staff Mgmt',   icon: UserCircle,      path: '/admin/staff' },
    { label: 'Calendar',     icon: CalendarPlus,    path: '/admin/calendar' },
    { label: 'Reports',      icon: History,         path: '/admin/reports' },
  ],
};

export const Sidebar: React.FC<SidebarProps> = ({ role, user, collapsed = false, onToggle }) => {
  const navigate = useNavigate();
  const navItems = navItemsByRole[role] || [];

  return (
    <aside
      className={`
        flex flex-col h-full transition-all duration-300 shrink-0
        bg-[rgba(18,35,36,0.85)] backdrop-blur-[16px]
        border-r border-[rgba(219,159,117,0.12)]
        ${collapsed ? 'w-[68px]' : 'w-[240px]'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[rgba(219,159,117,0.10)]`}>
        <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-[rgba(219,159,117,0.08)] flex items-center justify-center border border-[rgba(219,159,117,0.15)]">
          <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sand font-bold text-sm leading-tight truncate">AGMCET</p>
            <p className="text-[#7A6F65] text-[10px] font-medium leading-tight">HRMS Portal</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-[#7A6F65] hover:text-sand transition-colors p-1 rounded-lg hover:bg-[rgba(219,159,117,0.08)] shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-[rgba(219,159,117,0.10)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-copper to-deep flex items-center justify-center shrink-0">
              <span className="text-sand text-xs font-bold">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[#F5EFE6] text-sm font-semibold truncate">{user.name}</p>
              <p className="text-[#7A6F65] text-[10px] truncate">
                {user.role}{user.dept ? ` · ${user.dept}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} strokeWidth={1.75} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[rgba(219,159,117,0.10)]">
        <button
          onClick={() => navigate('/')}
          className={`sidebar-nav-item w-full text-left hover:!bg-[rgba(224,92,92,0.08)] hover:!text-[#E05C5C] ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

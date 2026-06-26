import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  message: string;
  sub: string;
  time: string;
  type: 'pending' | 'approved' | 'rejected' | 'forwarded';
}

interface TopBarProps {
  title: string;
  user: { name: string; role: string; dept?: string };
  notifications?: Notification[];
  onMenuToggle?: () => void;
}

const dotColor = {
  pending:   'bg-[#E8A838]',
  approved:  'bg-[#4CAF7D]',
  rejected:  'bg-[#E05C5C]',
  forwarded: 'bg-[#5B9BD5]',
};

const mockNotifications: Notification[] = [
  { id: '1', message: 'Adjustment request from Ravi Kumar', sub: 'Awaiting your review', time: '2 min ago', type: 'pending' },
  { id: '2', message: 'Leave pending your review', sub: 'Priya S. applied for 3 days', time: '10 min ago', type: 'forwarded' },
  { id: '3', message: 'Your leave was approved', sub: 'Annual Leave · July 5–7', time: 'Yesterday', type: 'approved' },
];

export const TopBar: React.FC<TopBarProps> = ({
  title,
  user,
  notifications = mockNotifications,
  onMenuToggle,
}) => {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 shrink-0 bg-[rgba(18,35,36,0.75)] backdrop-blur-[12px] border-b border-[rgba(219,159,117,0.10)] z-30">
      {/* Left: menu toggle + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-[#B0A090] hover:text-sand transition-colors p-1.5 rounded-lg hover:bg-[rgba(219,159,117,0.08)]"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-[#F5EFE6] font-semibold text-base tracking-tight">{title}</h2>
      </div>

      {/* Right: notification bell + user */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(o => !o); setUserOpen(false); }}
            className="relative p-2 rounded-lg text-[#B0A090] hover:text-sand hover:bg-[rgba(219,159,117,0.08)] transition-all"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-copper text-[#F5EFE6] text-[9px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50 border border-[rgba(219,159,117,0.18)] shadow-glass-hover"
              style={{ background: 'rgba(47,58,50,0.92)', backdropFilter: 'blur(20px)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(219,159,117,0.12)]">
                <span className="text-[#F5EFE6] font-semibold text-sm">Notifications</span>
                <button className="text-[#DB9F75] text-xs hover:text-sand transition-colors">Mark all read</button>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-[rgba(84,87,72,0.2)] hover:bg-[rgba(219,159,117,0.04)] transition-colors cursor-pointer last:border-0">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor[n.type]}`} />
                  <div>
                    <p className="text-[#F5EFE6] text-sm font-medium leading-snug">{n.message}</p>
                    <p className="text-[#7A6F65] text-xs mt-0.5">{n.sub}</p>
                    <p className="text-[#545748] text-[10px] mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[rgba(219,159,117,0.08)] transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-copper to-deep flex items-center justify-center">
              <span className="text-sand text-[11px] font-bold">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[#F5EFE6] text-xs font-semibold leading-tight">{user.name}</p>
              <p className="text-[#7A6F65] text-[10px] leading-tight">{user.role}</p>
            </div>
            <ChevronDown size={14} className="text-[#7A6F65] group-hover:text-sand transition-colors" />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50 border border-[rgba(219,159,117,0.18)] shadow-glass-hover"
              style={{ background: 'rgba(47,58,50,0.95)', backdropFilter: 'blur(20px)' }}>
              <div className="px-4 py-3 border-b border-[rgba(219,159,117,0.12)]">
                <p className="text-[#F5EFE6] text-sm font-semibold">{user.name}</p>
                <p className="text-[#7A6F65] text-xs">{user.role}{user.dept ? ` · ${user.dept}` : ''}</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-[#B0A090] hover:text-[#E05C5C] hover:bg-[rgba(224,92,92,0.06)] transition-colors text-sm"
                onClick={() => navigate('/')}>
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;

import { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { useRequireAuth } from '../../hooks/useAuth';
// Removed unused store import
import { Eye, EyeOff, User, Mail, Phone, Building2, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { useHrmsStore } from '../../store/hrmsStore';

export default function StaffProfile() {
  const { user } = useRequireAuth('staff');
  const { staff } = useHrmsStore();
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');

  if (!user) return null;
  const staffRecord = staff.find(s => s.id === user.id);

  const handlePwChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPw !== pw.confirm) { setPwMsg('Passwords do not match.'); return; }
    if (pw.newPw.length < 6) { setPwMsg('Password must be at least 6 characters.'); return; }
    setPwMsg('Password updated successfully!');
    setPw({ current: '', newPw: '', confirm: '' });
    setTimeout(() => setPwMsg(''), 3000);
  };

  const balances = [
    { label: 'Casual',   days: staffRecord?.casualBalance ?? 0 },
    { label: 'Sick',     days: staffRecord?.sickBalance ?? 0 },
    { label: 'Academic', days: staffRecord?.academicBalance ?? 0 },
    { label: 'Duty',     days: staffRecord?.dutyBalance ?? 0 },
  ];

  return (
    <DashboardLayout role="staff" user={{ name: user.name, role: user.designation ?? 'Staff', dept: user.department }} title="My Profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassCard hover={false} className="p-7 flex flex-col items-center text-center lg:col-span-1">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-copper to-deep flex items-center justify-center mb-4 shadow-copper">
            <span className="text-sand text-2xl font-bold">{user.name.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
          </div>
          <h3 className="text-[#F5EFE6] font-bold text-lg mb-0.5">{user.name}</h3>
          <p className="text-sand text-sm font-medium mb-1">{user.designation}</p>
          <p className="text-[#7A6F65] text-xs mb-6">{user.department} Department</p>

          <div className="w-full space-y-2.5 text-left">
            {[
              { icon: User, label: 'Employee ID', value: user.employeeId },
              { icon: Mail, label: 'Email', value: user.email },
              { icon: Phone, label: 'Phone', value: staffRecord?.phone ?? 'N/A' },
              { icon: Building2, label: 'Department', value: user.department ?? 'N/A' },
              { icon: Calendar, label: 'Joined', value: staffRecord ? formatDate(staffRecord.joinDate) : 'N/A' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[rgba(18,35,36,0.4)]">
                <item.icon size={14} className="text-sand mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#7A6F65] text-[10px] uppercase tracking-wider">{item.label}</p>
                  <p className="text-[#F5EFE6] text-xs font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-6">
          {/* Leave Balances */}
          <GlassCard hover={false} className="p-6">
            <h3 className="text-[#F5EFE6] font-bold text-base mb-4">Leave Balances</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {balances.map(b => (
                <div key={b.label} className="p-4 rounded-xl bg-[rgba(18,35,36,0.5)] border border-[rgba(219,159,117,0.08)] text-center">
                  <p className="text-[#7A6F65] text-[10px] uppercase tracking-wider mb-1">{b.label}</p>
                  <p className={`text-2xl font-bold ${b.days < 5 ? 'text-[#E8A838]' : 'text-[#4CAF7D]'}`}>{b.days}</p>
                  <p className="text-[#545748] text-xs">days left</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Change Password */}
          <GlassCard hover={false} className="p-6">
            <h3 className="text-[#F5EFE6] font-bold text-base mb-5">Change Password</h3>
            <form onSubmit={handlePwChange} className="space-y-4 max-w-sm">
              {[
                { label: 'Current Password', key: 'current' as const },
                { label: 'New Password',     key: 'newPw' as const },
                { label: 'Confirm Password', key: 'confirm' as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="input-label">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={pw[key]}
                      onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                      className="input-field pr-10"
                      required
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6F65] hover:text-sand transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
              {pwMsg && (
                <p className={`text-sm font-medium ${pwMsg.includes('success') ? 'text-[#4CAF7D]' : 'text-[#E05C5C]'}`}>{pwMsg}</p>
              )}
              <button type="submit" className="btn-primary w-auto px-6">Update Password</button>
            </form>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

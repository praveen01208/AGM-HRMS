import { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { useRequireAuth } from '../../hooks/useAuth';

export default function HodProfile() {
  const { user } = useRequireAuth('hod');
  const [pw, setPw] = useState({ current: '', newPw: '', confirm: '' });
  const [msg, setMsg] = useState('');
  if (!user) return null;

  const handlePwChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPw !== pw.confirm) { setMsg('Passwords do not match.'); return; }
    setMsg('Password updated successfully!');
    setPw({ current: '', newPw: '', confirm: '' });
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <DashboardLayout role="hod" user={{ name: user.name, role: user.designation ?? 'HOD', dept: user.department }} title="My Profile">
      <div className="max-w-2xl">
        <GlassCard hover={false} className="p-7 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-copper to-deep flex items-center justify-center shadow-copper shrink-0">
            <span className="text-sand text-2xl font-bold">{user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
          </div>
          <div>
            <h3 className="text-[#F5EFE6] font-bold text-xl mb-1">{user.name}</h3>
            <p className="text-sand text-sm font-medium mb-0.5">{user.designation}</p>
            <p className="text-[#7A6F65] text-xs">{user.department} Department</p>
            <p className="text-[#7A6F65] text-xs">{user.email}</p>
            <p className="text-[#7A6F65] text-xs">{user.employeeId}</p>
          </div>
        </GlassCard>
        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-bold text-base mb-5">Change Password</h3>
          <form onSubmit={handlePwChange} className="space-y-4 max-w-sm">
            {(['current','newPw','confirm'] as const).map(k => (
              <div key={k}><label className="input-label">{k === 'current' ? 'Current' : k === 'newPw' ? 'New' : 'Confirm'} Password</label>
                <input type="password" value={pw[k]} onChange={e => setPw(p=>({...p,[k]:e.target.value}))} className="input-field" required /></div>
            ))}
            {msg && <p className={`text-sm ${msg.includes('success') ? 'text-[#4CAF7D]' : 'text-[#E05C5C]'}`}>{msg}</p>}
            <button type="submit" className="btn-primary w-auto px-6">Update Password</button>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}

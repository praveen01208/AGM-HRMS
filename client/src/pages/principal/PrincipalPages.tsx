import { useState } from 'react';

import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore, type Leave } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';
import { AlertCircle, CheckCircle2, Users, TrendingUp } from 'lucide-react';

export default function PrincipalDashboard() {
  const { user } = useRequireAuth('principal');
  const { leaves } = useHrmsStore();
  if (!user) return null;

  const pending = leaves.filter(l => l.status === 'pending_principal');
  const approved = leaves.filter(l => l.status === 'approved');
  const allStaff = [...new Set(leaves.map(l => l.userId))].length;

  return (
    <DashboardLayout role="principal" user={{ name: user.name, role: 'Principal' }} title="Principal Dashboard">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { icon: AlertCircle,  label: 'Pending Final Approval', value: pending.length, sub: 'HOD-approved leaves', color: 'amber' },
          { icon: CheckCircle2, label: 'Approved This Year',     value: approved.length, sub: 'across all depts', color: 'green' },
          { icon: Users,        label: 'Staff w/ Applications',  value: allStaff, sub: 'unique applicants', color: 'blue' },
          { icon: TrendingUp,   label: 'Total Applications',     value: leaves.length, sub: 'institution-wide', color: 'copper' },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <GlassCard key={label} className="p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              color === 'copper' ? 'bg-copper/20 text-sand' :
              color === 'amber'  ? 'bg-[#E8A838]/15 text-[#E8A838]' :
              color === 'green'  ? 'bg-[#4CAF7D]/15 text-[#4CAF7D]' :
                                   'bg-[#5B9BD5]/15 text-[#5B9BD5]'
            }`}>
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[#B0A090] text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
              <p className="text-[#F5EFE6] text-2xl font-bold leading-none mb-0.5">{value}</p>
              <p className="text-[#7A6F65] text-xs">{sub}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(219,159,117,0.12)]">
          <h3 className="text-[#F5EFE6] font-bold text-base">Pending Final Approval</h3>
        </div>
        <DataTable<Leave>
          data={pending}
          columns={[
            { key: 'userName',   header: 'Staff',      sortable: true, render: r => <span className="font-semibold">{r.userName}</span> },
            { key: 'department', header: 'Dept',       render: r => r.department },
            { key: 'leaveType',  header: 'Type',       render: r => <span className="capitalize">{r.leaveType} Leave</span> },
            { key: 'fromDate',   header: 'From',       render: r => formatDate(r.fromDate) },
            { key: 'days',       header: 'Days',       render: r => `${r.days}d` },
            { key: 'hodRemarks', header: 'HOD Remark', render: r => <span className="text-[#B0A090] text-xs">{r.hodRemarks ?? '—'}</span> },
          ]}
          emptyMessage="No pending approvals."
        />
      </GlassCard>
    </DashboardLayout>
  );
}

export function PrincipalLeaveList() {
  const { user } = useRequireAuth('principal');
  const { leaves, updateLeaveStatus, addNotification } = useHrmsStore();
  const [modal, setModal] = useState<{ open: boolean; leaveId: number; action: 'approve' | 'reject'; remarks: string } | null>(null);
  const [filter, setFilter] = useState<'pending_principal' | 'approved' | 'rejected' | 'all'>('pending_principal');
  if (!user) return null;

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);

  const handleAction = () => {
    if (!modal) return;
    const leave = leaves.find(l => l.id === modal.leaveId);
    if (!leave) return;
    if (modal.action === 'approve') {
      updateLeaveStatus(modal.leaveId, 'approved', modal.remarks, 'principal');
      addNotification({ userId: leave.userId, message: 'Your leave was approved by Principal ✅', sub: `${leave.leaveType} leave · ${formatDate(leave.fromDate)}`, isRead: false, type: 'approved' });
    } else {
      updateLeaveStatus(modal.leaveId, 'rejected', modal.remarks, 'principal');
      addNotification({ userId: leave.userId, message: 'Your leave was rejected by Principal', sub: modal.remarks, isRead: false, type: 'rejected' });
    }
    setModal(null);
  };

  return (
    <DashboardLayout role="principal" user={{ name: user.name, role: 'Principal' }} title="Leave Approvals">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#F5EFE6] font-bold text-xl">Institution Leave Applications</h2>
        <div className="flex gap-2">
          {(['pending_principal', 'approved', 'rejected', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filter === f ? 'bg-copper/20 border-sand/30 text-sand' : 'border-[rgba(219,159,117,0.12)] text-[#7A6F65] hover:text-sand hover:border-sand/20'}`}>
              {f === 'pending_principal' ? 'Pending' : f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <DataTable<Leave>
        data={filtered}
        searchKeys={['userName', 'department', 'leaveType']}
        columns={[
          { key: 'userName',   header: 'Staff',    sortable: true, render: r => <span className="font-semibold">{r.userName}</span> },
          { key: 'department', header: 'Dept',     sortable: true },
          { key: 'leaveType',  header: 'Type',     render: r => <span className="capitalize">{r.leaveType} Leave</span> },
          { key: 'fromDate',   header: 'From',     render: r => formatDate(r.fromDate) },
          { key: 'toDate',     header: 'To',       render: r => formatDate(r.toDate) },
          { key: 'days',       header: 'Days',     render: r => `${r.days}d` },
          { key: 'status',     header: 'Status',   render: r => <StatusBadge status={r.status === 'approved' ? 'approved' : r.status === 'rejected' ? 'rejected' : r.status === 'pending_principal' ? 'forwarded' : 'pending'} /> },
        ]}
        emptyMessage="No applications found."
        actions={r => r.status === 'pending_principal' ? (
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal({ open: true, leaveId: r.id, action: 'approve', remarks: '' })}
              className="px-3 py-1.5 rounded-lg bg-[#4CAF7D]/15 text-[#4CAF7D] border border-[#4CAF7D]/25 text-xs font-semibold hover:bg-[#4CAF7D]/25 transition-colors">
              Approve
            </button>
            <button onClick={() => setModal({ open: true, leaveId: r.id, action: 'reject', remarks: '' })}
              className="px-3 py-1.5 rounded-lg bg-[#E05C5C]/10 text-[#E05C5C] border border-[#E05C5C]/25 text-xs font-semibold hover:bg-[#E05C5C]/20 transition-colors">
              Reject
            </button>
          </div>
        ) : null}
      />
      <Modal
        open={modal?.open ?? false}
        title={modal?.action === 'approve' ? 'Final Approval' : 'Reject Leave'}
        message={modal?.action === 'approve' ? 'This is the final approval. The staff member will be notified immediately.' : 'The staff member will be notified of the rejection.'}
        variant={modal?.action === 'approve' ? 'approve' : 'reject'}
        confirmLabel={modal?.action === 'approve' ? 'Final Approve' : 'Reject'}
        remarks={modal?.remarks ?? ''}
        onRemarksChange={v => setModal(m => m ? { ...m, remarks: v } : null)}
        remarksLabel="Principal Remarks"
        onConfirm={handleAction}
        onClose={() => setModal(null)}
      />
    </DashboardLayout>
  );
}

export function PrincipalReports() {
  const { user } = useRequireAuth('principal');
  const { leaves } = useHrmsStore();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  if (!user) return null;

  const depts = [...new Set(leaves.map(l => l.department))];
  const filtered = leaves.filter(l => {
    const inRange = (!from || l.fromDate >= from) && (!to || l.toDate <= to);
    const inDept = deptFilter === 'all' || l.department === deptFilter;
    return inRange && inDept;
  });

  const handleExport = () => {
    const csv = ['Staff,Department,Type,From,To,Days,Status,Reason',
      ...filtered.map(l => `${l.userName},${l.department},${l.leaveType},${l.fromDate},${l.toDate},${l.days},${l.status},"${l.reason}"`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leave_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="principal" user={{ name: user.name, role: 'Principal' }} title="Leave Reports">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#F5EFE6] font-bold text-xl">Leave Reports</h2>
        <button onClick={handleExport} className="btn-primary w-auto px-5 py-2.5">↓ Export CSV</button>
      </div>

      <GlassCard hover={false} className="p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="input-label">From Date</label><input type="date" value={from} onChange={e => setFrom(e.target.value)} className="input-field" /></div>
          <div><label className="input-label">To Date</label><input type="date" value={to} onChange={e => setTo(e.target.value)} className="input-field" /></div>
          <div>
            <label className="input-label">Department</label>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field">
              <option value="all" style={{ background: '#122324' }}>All Departments</option>
              {depts.map(d => <option key={d} value={d} style={{ background: '#122324' }}>{d}</option>)}
            </select>
          </div>
        </div>
        <p className="text-[#7A6F65] text-xs mt-3">{filtered.length} records found</p>
      </GlassCard>

      <DataTable<Leave>
        data={filtered}
        searchKeys={['userName', 'department', 'leaveType']}
        columns={[
          { key: 'userName',   header: 'Staff',  sortable: true, render: r => <span className="font-semibold">{r.userName}</span> },
          { key: 'department', header: 'Dept',   sortable: true },
          { key: 'leaveType',  header: 'Type',   render: r => <span className="capitalize">{r.leaveType}</span> },
          { key: 'fromDate',   header: 'From',   sortable: true, render: r => formatDate(r.fromDate) },
          { key: 'toDate',     header: 'To',     render: r => formatDate(r.toDate) },
          { key: 'days',       header: 'Days',   render: r => `${r.days}d` },
          { key: 'status',     header: 'Status', render: r => <StatusBadge status={r.status === 'approved' ? 'approved' : r.status === 'rejected' ? 'rejected' : r.status === 'pending_principal' ? 'forwarded' : 'pending'} /> },
        ]}
        emptyMessage="No records match the filters."
      />
    </DashboardLayout>
  );
}

export function PrincipalProfile() {
  const { user } = useRequireAuth('principal');
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
    <DashboardLayout role="principal" user={{ name: user.name, role: 'Principal' }} title="My Profile">
      <div className="max-w-2xl">
        <GlassCard hover={false} className="p-7 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-copper to-deep flex items-center justify-center shadow-copper shrink-0">
            <span className="text-sand text-2xl font-bold">{user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
          </div>
          <div>
            <h3 className="text-[#F5EFE6] font-bold text-xl mb-1">{user.name}</h3>
            <p className="text-sand text-sm font-medium mb-0.5">Principal</p>
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

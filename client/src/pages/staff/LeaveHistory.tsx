import { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore, Leave } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';

export default function LeaveHistory() {
  const { user } = useRequireAuth('staff');
  const { leaves } = useHrmsStore();
  const [yearFilter, setYearFilter] = useState('all');
  if (!user) return null;

  const myLeaves = leaves.filter(l => l.userId === user.id);
  const years = [...new Set(myLeaves.map(l => new Date(l.appliedAt).getFullYear().toString()))].sort((a,b) => Number(b)-Number(a));
  const filtered = yearFilter === 'all' ? myLeaves : myLeaves.filter(l => new Date(l.appliedAt).getFullYear().toString() === yearFilter);

  const summary = {
    casual:   filtered.filter(l => l.leaveType === 'casual'   && l.status === 'approved').reduce((s, l) => s + l.days, 0),
    sick:     filtered.filter(l => l.leaveType === 'sick'     && l.status === 'approved').reduce((s, l) => s + l.days, 0),
    academic: filtered.filter(l => l.leaveType === 'academic' && l.status === 'approved').reduce((s, l) => s + l.days, 0),
    duty:     filtered.filter(l => l.leaveType === 'duty'     && l.status === 'approved').reduce((s, l) => s + l.days, 0),
  };

  return (
    <DashboardLayout role="staff" user={{ name: user.name, role: user.designation ?? 'Staff', dept: user.department }} title="Leave History">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#F5EFE6] font-bold text-xl mb-1">Leave History</h2>
          <p className="text-[#7A6F65] text-sm">Year-wise summary of all leave applications</p>
        </div>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="input-field w-auto px-4 py-2.5 text-sm">
          <option value="all" style={{ background: '#122324' }}>All Years</option>
          {years.map(y => <option key={y} value={y} style={{ background: '#122324' }}>{y}</option>)}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(summary).map(([type, days]) => (
          <div key={type} className="glass-card p-4 text-center">
            <p className="text-[#7A6F65] text-[10px] uppercase tracking-wider font-semibold mb-1 capitalize">{type} Leave</p>
            <p className="text-[#F5EFE6] text-2xl font-bold">{days}</p>
            <p className="text-[#545748] text-xs">days approved</p>
          </div>
        ))}
      </div>

      <DataTable<Leave>
        data={filtered}
        searchKeys={['leaveType', 'reason']}
        columns={[
          { key: 'leaveType',  header: 'Type',    sortable: true, render: r => <span className="capitalize font-medium">{r.leaveType} Leave</span> },
          { key: 'fromDate',   header: 'From',    sortable: true, render: r => formatDate(r.fromDate) },
          { key: 'toDate',     header: 'To',      render: r => formatDate(r.toDate) },
          { key: 'days',       header: 'Days',    render: r => `${r.days}d` },
          { key: 'reason',     header: 'Reason',  render: r => <span className="text-[#B0A090] line-clamp-1">{r.reason}</span> },
          { key: 'status',     header: 'Status',  render: r => (
            <StatusBadge status={r.status === 'approved' ? 'approved' : r.status === 'rejected' ? 'rejected' : r.status === 'pending_principal' ? 'forwarded' : 'pending'} />
          )},
          { key: 'appliedAt',  header: 'Applied', sortable: true, render: r => <span className="text-[#B0A090]">{formatDate(r.appliedAt)}</span> },
        ]}
        emptyMessage="No leave history for the selected period."
      />
    </DashboardLayout>
  );
}

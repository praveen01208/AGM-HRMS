import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore, Leave } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';

export default function HodLeaveList() {
  const { user } = useRequireAuth('hod');
  const navigate = useNavigate();
  const { leaves } = useHrmsStore();
  const [filter, setFilter] = useState<'all' | 'pending_hod' | 'approved' | 'rejected'>('all');
  if (!user) return null;

  const deptLeaves = leaves.filter(l => l.departmentId === user.departmentId);
  const filtered = filter === 'all' ? deptLeaves : deptLeaves.filter(l =>
    filter === 'pending_hod' ? l.status === 'pending_hod' :
    filter === 'approved' ? (l.status === 'approved' || l.status === 'pending_principal') :
    l.status === 'rejected'
  );

  return (
    <DashboardLayout role="hod" user={{ name: user.name, role: user.designation ?? 'HOD', dept: user.department }} title="Department Leaves">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#F5EFE6] font-bold text-xl mb-1">{user.department} Dept. — Leave Applications</h2>
          <p className="text-[#7A6F65] text-sm">{deptLeaves.length} total · Click a row to review</p>
        </div>
        <div className="flex gap-2">
          {(['all','pending_hod','approved','rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filter === f
                  ? 'bg-copper/20 border-sand/30 text-sand'
                  : 'border-[rgba(219,159,117,0.12)] text-[#7A6F65] hover:text-sand hover:border-sand/20'
              }`}>
              {f === 'all' ? 'All' : f === 'pending_hod' ? 'Pending' : f === 'approved' ? 'Approved' : 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      <DataTable<Leave>
        data={filtered}
        searchKeys={['userName', 'leaveType', 'reason']}
        columns={[
          { key: 'userName',  header: 'Staff',     sortable: true, render: r => <span className="font-semibold">{r.userName}</span> },
          { key: 'leaveType', header: 'Type',      sortable: true, render: r => <span className="capitalize">{r.leaveType} Leave</span> },
          { key: 'fromDate',  header: 'From',      sortable: true, render: r => formatDate(r.fromDate) },
          { key: 'toDate',    header: 'To',        render: r => formatDate(r.toDate) },
          { key: 'days',      header: 'Days',      render: r => `${r.days}d` },
          { key: 'reason',    header: 'Reason',    render: r => <span className="text-[#B0A090] line-clamp-1">{r.reason}</span> },
          { key: 'status',    header: 'Status',    render: r => (
            <StatusBadge status={r.status === 'approved' ? 'approved' : r.status === 'rejected' ? 'rejected' : r.status === 'pending_principal' ? 'forwarded' : 'pending'} />
          )},
          { key: 'appliedAt', header: 'Applied',   sortable: true, render: r => <span className="text-[#B0A090]">{formatDate(r.appliedAt)}</span> },
        ]}
        emptyMessage={`No ${filter === 'all' ? '' : filter.replace('_',' ')} applications.`}
        onRowClick={r => navigate(`/hod/leaves/${r.id}`)}
      />
    </DashboardLayout>
  );
}

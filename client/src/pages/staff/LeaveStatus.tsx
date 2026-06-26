import { DashboardLayout } from '../../components/DashboardLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore, Leave } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function LeaveStatus() {
  const { user } = useRequireAuth('staff');
  const navigate = useNavigate();
  const { leaves } = useHrmsStore();
  if (!user) return null;

  const myLeaves = leaves.filter(l => l.userId === user.id);

  const statusLabel = (s: Leave['status']) => {
    const map: Record<Leave['status'], string> = {
      pending_adjustment: 'Pending Adjustment',
      pending_hod: 'Pending HOD',
      pending_principal: 'Pending Principal',
      approved: 'Approved',
      rejected: 'Rejected',
    };
    return map[s];
  };

  const badgeStatus = (s: Leave['status']) =>
    s === 'approved' ? 'approved' :
    s === 'rejected' ? 'rejected' :
    s === 'pending_principal' ? 'forwarded' : 'pending';

  return (
    <DashboardLayout role="staff" user={{ name: user.name, role: user.designation ?? 'Staff', dept: user.department }} title="Leave Status">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#F5EFE6] font-bold text-xl mb-1">My Leave Applications</h2>
          <p className="text-[#7A6F65] text-sm">{myLeaves.length} total applications</p>
        </div>
        <button onClick={() => navigate('/staff/leave/apply')} className="btn-primary w-auto px-5 py-2.5">
          <Plus size={16} /> New Application
        </button>
      </div>

      <DataTable<Leave>
        data={myLeaves}
        searchKeys={['leaveType', 'reason']}
        columns={[
          { key: 'leaveType',  header: 'Type',    sortable: true, render: r => <span className="capitalize font-medium">{r.leaveType} Leave</span> },
          { key: 'fromDate',   header: 'From',    sortable: true, render: r => formatDate(r.fromDate) },
          { key: 'toDate',     header: 'To',      render: r => formatDate(r.toDate) },
          { key: 'days',       header: 'Days',    render: r => `${r.days}d` },
          { key: 'reason',     header: 'Reason',  render: r => <span className="text-[#B0A090] line-clamp-1">{r.reason}</span> },
          { key: 'status',     header: 'Status',  render: r => <StatusBadge status={badgeStatus(r.status)} /> },
          { key: 'appliedAt',  header: 'Applied', sortable: true, render: r => <span className="text-[#B0A090]">{formatDate(r.appliedAt)}</span> },
        ]}
        emptyMessage="No leave applications found."
        actions={r => r.status.startsWith('pending') ? (
          <span className="text-[#7A6F65] text-xs italic">Awaiting: {statusLabel(r.status)}</span>
        ) : null}
      />

      {/* Remarks section */}
      {myLeaves.some(l => l.hodRemarks || l.principalRemarks) && (
        <div className="mt-6 glass-card p-6">
          <h3 className="text-[#F5EFE6] font-bold text-base mb-4">Remarks from Approvers</h3>
          {myLeaves.filter(l => l.hodRemarks || l.principalRemarks).map(l => (
            <div key={l.id} className="mb-4 last:mb-0 p-4 rounded-xl bg-[rgba(18,35,36,0.4)] border border-[rgba(219,159,117,0.08)]">
              <p className="text-sand text-xs font-bold uppercase tracking-wider mb-2 capitalize">{l.leaveType} Leave — {formatDate(l.fromDate)}</p>
              {l.hodRemarks && <p className="text-[#B0A090] text-sm mb-1"><span className="text-[#7A6F65]">HOD:</span> {l.hodRemarks}</p>}
              {l.principalRemarks && <p className="text-[#B0A090] text-sm"><span className="text-[#7A6F65]">Principal:</span> {l.principalRemarks}</p>}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore, type Leave } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';
import { AlertCircle, CheckCircle2, Users, Calendar } from 'lucide-react';

export default function HodDashboard() {
  const { user } = useRequireAuth('hod');
  const navigate = useNavigate();
  const { leaves, staff } = useHrmsStore();
  if (!user) return null;

  const deptLeaves = leaves.filter(l => l.departmentId === user.departmentId);
  const pending = deptLeaves.filter(l => l.status === 'pending_hod');
  const approved = deptLeaves.filter(l => l.status === 'approved' || l.status === 'pending_principal');
  const deptStaff = staff.filter(s => s.departmentId === user.departmentId && s.role === 'staff');

  return (
    <DashboardLayout role="hod" user={{ name: user.name, role: user.designation ?? 'HOD', dept: user.department }} title="HOD Dashboard">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { icon: AlertCircle,  label: 'Pending Approval', value: pending.length, sub: 'require your action', color: 'amber' },
          { icon: Users,        label: 'Dept. Staff',      value: deptStaff.length, sub: `in ${user.department}`, color: 'blue' },
          { icon: CheckCircle2, label: 'Forwarded',        value: approved.length, sub: 'leaves this year', color: 'green' },
          { icon: Calendar,     label: 'Total Leaves',     value: deptLeaves.length, sub: 'dept. applications', color: 'copper' },
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
        <div className="px-6 py-4 border-b border-[rgba(219,159,117,0.12)] flex items-center justify-between">
          <h3 className="text-[#F5EFE6] font-bold text-base">Pending Approvals</h3>
          <button onClick={() => navigate('/hod/leaves')} className="text-sand text-xs font-semibold hover:text-[#F5EFE6] transition-colors">View all →</button>
        </div>
        <DataTable<Leave>
          data={pending}
          columns={[
            { key: 'userName',  header: 'Staff',     sortable: true, render: r => <span className="font-semibold">{r.userName}</span> },
            { key: 'leaveType', header: 'Type',      render: r => <span className="capitalize">{r.leaveType} Leave</span> },
            { key: 'fromDate',  header: 'From',      render: r => formatDate(r.fromDate) },
            { key: 'toDate',    header: 'To',        render: r => formatDate(r.toDate) },
            { key: 'days',      header: 'Days',      render: r => `${r.days}d` },
            { key: 'status',    header: 'Status',    render: () => <StatusBadge status="pending" /> },
          ]}
          emptyMessage="No pending approvals."
          onRowClick={r => navigate(`/hod/leaves/${r.id}`)}
        />
      </GlassCard>
    </DashboardLayout>
  );
}

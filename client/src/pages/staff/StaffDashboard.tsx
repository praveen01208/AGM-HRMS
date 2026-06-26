import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore } from '../../store/hrmsStore';
import { CalendarDays, Clock, CheckCircle2, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

export default function StaffDashboard() {
  const { user } = useRequireAuth('staff');
  const navigate = useNavigate();
  const { leaves, adjustments, notifications } = useHrmsStore();

  if (!user) return null;

  const myLeaves = leaves.filter(l => l.userId === user.id);
  const myPending = myLeaves.filter(l => l.status === 'pending_hod' || l.status === 'pending_principal' || l.status === 'pending_adjustment');
  const myApproved = myLeaves.filter(l => l.status === 'approved');
  const incomingAdj = adjustments.filter(a => a.adjusterId === user.id && a.status === 'pending');
  const myNotifications = notifications.filter(n => n.userId === user.id && !n.isRead);

  // Leave balances from store staff record
  const leaveBalance = 12; // from seedStaff for John Doe

  return (
    <DashboardLayout role="staff" user={{ name: user.name, role: user.designation ?? 'Staff', dept: user.department }}>
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-8">
        {[
          { icon: CalendarDays, label: 'Leave Balance',      value: leaveBalance, sub: 'casual days remaining', color: 'copper' },
          { icon: Clock,        label: 'Pending',            value: myPending.length, sub: 'awaiting review', color: 'amber' },
          { icon: CheckCircle2, label: 'Approved',           value: myApproved.length, sub: 'this year', color: 'green' },
          { icon: AlertCircle,  label: 'Adjustments Req.',   value: incomingAdj.length, sub: 'need your response', color: 'blue' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-bold text-base mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Apply for Leave', sub: 'Submit new application', path: '/staff/leave/apply', icon: Plus },
              { label: 'View Leave Status', sub: 'Check application status', path: '/staff/leave/status', icon: ArrowRight },
              { label: 'Respond to Adjustments', sub: `${incomingAdj.length} incoming request${incomingAdj.length !== 1 ? 's' : ''}`, path: '/staff/adjustment/respond', icon: ArrowRight },
            ].map(a => (
              <button key={a.path} onClick={() => navigate(a.path)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[rgba(219,159,117,0.12)] hover:border-sand/30 hover:bg-sand/5 transition-all text-left group">
                <div className="w-8 h-8 rounded-lg bg-copper/15 flex items-center justify-center shrink-0 group-hover:bg-copper/25 transition-colors">
                  <a.icon size={15} className="text-sand" />
                </div>
                <div>
                  <p className="text-[#F5EFE6] text-sm font-semibold group-hover:text-sand transition-colors">{a.label}</p>
                  <p className="text-[#7A6F65] text-xs">{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Recent Applications */}
        <GlassCard hover={false} className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[#F5EFE6] font-bold text-base">Recent Applications</h3>
            <button onClick={() => navigate('/staff/leave/status')} className="text-sand text-xs font-semibold hover:text-[#F5EFE6] transition-colors">View all →</button>
          </div>
          {myLeaves.length === 0 ? (
            <p className="text-[#545748] text-sm text-center py-8">No leave applications yet.</p>
          ) : (
            <div className="space-y-3">
              {myLeaves.slice(0, 4).map(l => (
                <div key={l.id} className="flex items-center justify-between p-3.5 rounded-xl bg-[rgba(18,35,36,0.4)] border border-[rgba(219,159,117,0.08)]">
                  <div>
                    <p className="text-[#F5EFE6] text-sm font-semibold capitalize">{l.leaveType} Leave</p>
                    <p className="text-[#7A6F65] text-xs mt-0.5">{formatDate(l.fromDate)} – {formatDate(l.toDate)} · {l.days}d</p>
                  </div>
                  <StatusBadge status={
                    l.status === 'approved' ? 'approved' :
                    l.status === 'rejected' ? 'rejected' :
                    l.status.startsWith('pending') ? 'pending' : 'forwarded'
                  } />
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}

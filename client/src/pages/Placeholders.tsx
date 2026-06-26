import { DashboardLayout } from '../components/DashboardLayout';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { CalendarDays, Clock, CheckCircle2, AlertCircle, Users, FileText, TrendingUp, Calendar } from 'lucide-react';

// ─── Shared Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'copper' }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  color?: 'copper' | 'green' | 'amber' | 'blue';
}) {
  const iconBg = {
    copper: 'bg-copper/20 text-sand',
    green:  'bg-[#4CAF7D]/15 text-[#4CAF7D]',
    amber:  'bg-[#E8A838]/15 text-[#E8A838]',
    blue:   'bg-[#5B9BD5]/15 text-[#5B9BD5]',
  }[color];

  return (
    <GlassCard className="p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-[#B0A090] text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-[#F5EFE6] text-3xl font-bold leading-none mb-1">{value}</p>
        <p className="text-[#7A6F65] text-xs">{sub}</p>
      </div>
    </GlassCard>
  );
}

// ─── Staff Dashboard ──────────────────────────────────────────────────────────
export function StaffDashboard() {
  const user = { name: 'John Doe', role: 'Staff', dept: 'CSE' };

  const recentLeaves = [
    { id: 'L001', type: 'Medical Leave',  dates: 'Jun 10–12, 2025', days: 3, status: 'approved'  as const },
    { id: 'L002', type: 'Annual Leave',   dates: 'Jul 5–7, 2025',   days: 3, status: 'pending'   as const },
    { id: 'L003', type: 'Emergency Leave',dates: 'May 22, 2025',    days: 1, status: 'rejected'  as const },
  ];

  return (
    <DashboardLayout role="staff" user={user} title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={CalendarDays} label="Leave Balance"      value="12"  sub="days remaining this year"  color="copper" />
        <StatCard icon={Clock}        label="Pending Approvals"  value="1"   sub="awaiting HOD review"        color="amber"  />
        <StatCard icon={CheckCircle2} label="Leaves Approved"    value="8"   sub="this academic year"         color="green"  />
        <StatCard icon={AlertCircle}  label="Attendance"         value="96%" sub="present this month"         color="blue"   />
      </div>

      {/* Recent Leaves */}
      <GlassCard hover={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(219,159,117,0.12)] flex items-center justify-between">
          <h3 className="text-[#F5EFE6] font-semibold text-base">Recent Leave Applications</h3>
          <button className="text-sand text-xs font-semibold hover:text-[#F5EFE6] transition-colors">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[rgba(18,35,36,0.6)] border-b border-[rgba(219,159,117,0.10)]">
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Leave Type</th>
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Dates</th>
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Days</th>
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeaves.map(l => (
                <tr key={l.id} className="border-b border-[rgba(84,87,72,0.2)] hover:bg-[rgba(219,159,117,0.03)] transition-colors">
                  <td className="px-6 py-4 text-[#F5EFE6] text-sm font-medium">{l.type}</td>
                  <td className="px-6 py-4 text-[#B0A090] text-sm">{l.dates}</td>
                  <td className="px-6 py-4 text-[#B0A090] text-sm">{l.days}</td>
                  <td className="px-6 py-4"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}

// ─── HOD Dashboard ─────────────────────────────────────────────────────────
export function HodDashboard() {
  const user = { name: 'Dr. Meera Rajan', role: 'HOD', dept: 'CSE' };

  const pendingApprovals = [
    { name: 'Ravi Kumar',  type: 'Medical Leave',  dates: 'Jun 18–19',  days: 2, status: 'pending'   as const },
    { name: 'Priya S.',    type: 'Annual Leave',   dates: 'Jun 22–25',  days: 4, status: 'pending'   as const },
    { name: 'Arun Menon',  type: 'Emergency',      dates: 'Jun 17',     days: 1, status: 'forwarded' as const },
  ];

  return (
    <DashboardLayout role="hod" user={user} title="HOD Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={AlertCircle}  label="Pending Approvals" value="3"  sub="require your action"     color="amber"  />
        <StatCard icon={Users}        label="Team Strength"     value="24" sub="staff in CSE dept"        color="blue"   />
        <StatCard icon={CheckCircle2} label="Approved This Mo." value="11" sub="out of 14 applications"   color="green"  />
        <StatCard icon={Calendar}     label="On Leave Today"    value="2"  sub="staff absent"             color="copper" />
      </div>

      <GlassCard hover={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(219,159,117,0.12)] flex items-center justify-between">
          <h3 className="text-[#F5EFE6] font-semibold text-base">Pending Approvals</h3>
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8A838]/15 text-[#E8A838] text-xs font-bold border border-[#E8A838]/30">
            {pendingApprovals.filter(p => p.status === 'pending').length} pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[rgba(18,35,36,0.6)] border-b border-[rgba(219,159,117,0.10)]">
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Staff Name</th>
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Leave Type</th>
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Dates</th>
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((a, i) => (
                <tr key={i} className="border-b border-[rgba(84,87,72,0.2)] hover:bg-[rgba(219,159,117,0.03)] transition-colors">
                  <td className="px-6 py-4 text-[#F5EFE6] text-sm font-medium">{a.name}</td>
                  <td className="px-6 py-4 text-[#B0A090] text-sm">{a.type}</td>
                  <td className="px-6 py-4 text-[#B0A090] text-sm">{a.dates} ({a.days}d)</td>
                  <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-[#4CAF7D]/15 text-[#4CAF7D] border border-[#4CAF7D]/25 text-xs font-semibold hover:bg-[#4CAF7D]/25 transition-colors">Approve</button>
                      <button className="px-3 py-1.5 rounded-lg bg-[#E05C5C]/10 text-[#E05C5C] border border-[#E05C5C]/25 text-xs font-semibold hover:bg-[#E05C5C]/20 transition-colors">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardLayout>
  );
}

// ─── Principal Dashboard ──────────────────────────────────────────────────────
export function PrincipalDashboard() {
  const user = { name: 'Prof. S. Arumugam', role: 'Principal' };

  return (
    <DashboardLayout role="principal" user={user} title="Principal Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Users}        label="Total Staff"       value="148" sub="across all departments"     color="blue"   />
        <StatCard icon={AlertCircle}  label="Pending Reviews"   value="7"   sub="require principal sign-off"  color="amber"  />
        <StatCard icon={CheckCircle2} label="Leaves This Month" value="42"  sub="approved institute-wide"     color="green"  />
        <StatCard icon={TrendingUp}   label="Attendance Rate"   value="94%" sub="avg. across departments"     color="copper" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-semibold text-base mb-5">Department Summary</h3>
          <div className="space-y-4">
            {[
              { dept: 'CSE',   staff: 28, present: 27, leaves: 3 },
              { dept: 'ECE',   staff: 24, present: 23, leaves: 1 },
              { dept: 'MECH',  staff: 22, present: 21, leaves: 2 },
              { dept: 'CIVIL', staff: 18, present: 18, leaves: 0 },
              { dept: 'IT',    staff: 20, present: 19, leaves: 1 },
            ].map(d => (
              <div key={d.dept} className="flex items-center justify-between py-2 border-b border-[rgba(84,87,72,0.2)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-copper/15 flex items-center justify-center">
                    <span className="text-sand text-[10px] font-bold">{d.dept}</span>
                  </div>
                  <span className="text-[#F5EFE6] text-sm font-medium">{d.dept} Dept</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#B0A090]">{d.staff} staff</span>
                  <span className="text-[#4CAF7D]">{d.present} present</span>
                  {d.leaves > 0 && <span className="text-[#E8A838]">{d.leaves} on leave</span>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-semibold text-base mb-5">Pending Approvals</h3>
          <div className="space-y-3">
            {[
              { name: 'Dr. M. Rajan',  dept: 'CSE', count: 3, type: 'HOD Forwarded' },
              { name: 'Mr. K. Suresh', dept: 'ECE', count: 2, type: 'HOD Forwarded' },
              { name: 'Ms. R. Priya',  dept: 'MECH',count: 1, type: 'HOD Forwarded' },
              { name: 'Dr. A. Kumar',  dept: 'IT',  count: 1, type: 'Awaiting HOD'  },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(18,35,36,0.4)] border border-[rgba(219,159,117,0.08)]">
                <div>
                  <p className="text-[#F5EFE6] text-sm font-medium">{a.name}</p>
                  <p className="text-[#7A6F65] text-xs">{a.dept} · {a.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#E8A838] text-sm font-bold">{a.count}</span>
                  <button className="px-3 py-1 rounded-lg btn-primary text-xs py-1.5">Review</button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export function AdminDashboard() {
  const user = { name: 'Admin', role: 'Administrator' };

  return (
    <DashboardLayout role="admin" user={user} title="Admin Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Users}       label="Total Staff"     value="148" sub="registered in the system"    color="blue"   />
        <StatCard icon={FileText}    label="Leave Requests"  value="63"  sub="this academic year"           color="copper" />
        <StatCard icon={CheckCircle2}label="Approved"        value="54"  sub="successfully processed"       color="green"  />
        <StatCard icon={AlertCircle} label="Rejected"        value="9"   sub="declined requests"            color="amber"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard hover={false} className="p-6 lg:col-span-2">
          <h3 className="text-[#F5EFE6] font-semibold text-base mb-5">Staff Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(219,159,117,0.10)]">
                  <th className="text-left py-3 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Dept</th>
                  <th className="text-left py-3 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 text-[#DB9F75] text-xs font-semibold uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe',   dept: 'CSE',   role: 'Staff',  balance: 12 },
                  { name: 'Ravi Kumar', dept: 'ECE',   role: 'Staff',  balance: 8  },
                  { name: 'Priya S.',   dept: 'CSE',   role: 'Staff',  balance: 15 },
                  { name: 'Arun M.',    dept: 'MECH',  role: 'Staff',  balance: 6  },
                ].map((s, i) => (
                  <tr key={i} className="border-b border-[rgba(84,87,72,0.15)] hover:bg-[rgba(219,159,117,0.03)] transition-colors">
                    <td className="py-3.5 text-[#F5EFE6] text-sm font-medium">{s.name}</td>
                    <td className="py-3.5 text-[#B0A090] text-sm">{s.dept}</td>
                    <td className="py-3.5 text-[#B0A090] text-sm">{s.role}</td>
                    <td className="py-3.5">
                      <span className={`font-bold text-sm ${s.balance < 8 ? 'text-[#E8A838]' : 'text-[#4CAF7D]'}`}>
                        {s.balance}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-semibold text-base mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Staff',       desc: 'Register staff member' },
              { label: 'Configure Leave Types',desc: 'Manage leave policies' },
              { label: 'Generate Reports',     desc: 'Export attendance data' },
              { label: 'System Settings',      desc: 'App configuration' },
            ].map((a, i) => (
              <button key={i} className="w-full text-left p-3.5 rounded-xl border border-[rgba(219,159,117,0.12)] hover:border-[rgba(219,159,117,0.28)] hover:bg-[rgba(219,159,117,0.04)] transition-all group">
                <p className="text-[#F5EFE6] text-sm font-semibold group-hover:text-sand transition-colors">{a.label}</p>
                <p className="text-[#7A6F65] text-xs mt-0.5">{a.desc}</p>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}

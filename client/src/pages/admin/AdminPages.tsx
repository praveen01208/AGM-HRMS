import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore, type StaffMember, type Leave, type Holiday } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';
import { Users, FileText, CheckCircle2, AlertCircle, Plus, Trash2, Edit3, RotateCcw, Calendar } from 'lucide-react';

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user } = useRequireAuth('admin');
  const { leaves, staff } = useHrmsStore();
  const navigate = useNavigate();
  if (!user) return null;

  const approved = leaves.filter(l => l.status === 'approved').length;
  const pending  = leaves.filter(l => l.status.startsWith('pending')).length;

  const stats = [
    { icon: Users,        label: 'Total Staff',    value: staff.length,    sub: 'registered in system', color: 'blue', path: '/admin/staff' },
    { icon: FileText,     label: 'Leave Requests', value: leaves.length,   sub: 'this academic year',   color: 'copper', path: '/admin/reports' },
    { icon: CheckCircle2, label: 'Approved',        value: approved,        sub: 'total approved',       color: 'green', path: null },
    { icon: AlertCircle,  label: 'Pending',         value: pending,         sub: 'in pipeline',          color: 'amber', path: null },
  ];

  return (
    <DashboardLayout role="admin" user={{ name: user.name, role: 'Administrator' }} title="Admin Dashboard">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, sub, color, path }) => (
          <GlassCard key={label} className="p-5 flex items-start gap-4" onClick={path ? () => navigate(path) : undefined}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-bold text-base mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Staff',         sub: 'Register a new staff member',   path: '/admin/staff/add',       icon: Plus },
              { label: 'Manage Staff',           sub: 'Edit or delete staff records',  path: '/admin/staff',           icon: Edit3 },
              { label: 'Holiday Calendar',       sub: 'Manage holidays and term dates',path: '/admin/calendar',        icon: Calendar },
              { label: 'Leave Reports',          sub: 'Search and export reports',     path: '/admin/reports',         icon: FileText },
              { label: 'Reset Staff Password',   sub: 'Reset credentials',             path: '/admin/reset/staff',     icon: RotateCcw },
            ].map(a => (
              <button key={a.path} onClick={() => navigate(a.path)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[rgba(219,159,117,0.12)] hover:border-sand/30 hover:bg-sand/5 transition-all text-left group">
                <div className="w-8 h-8 rounded-lg bg-copper/15 flex items-center justify-center shrink-0">
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

        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-bold text-base mb-5">Dept. Leave Summary</h3>
          {['CSE','ECE','MECH'].map(dept => {
            const dl = leaves.filter(l => l.department === dept);
            const app = dl.filter(l => l.status === 'approved').length;
            return (
              <div key={dept} className="flex items-center justify-between py-3 border-b border-[rgba(84,87,72,0.2)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-copper/15 flex items-center justify-center">
                    <span className="text-sand text-[10px] font-bold">{dept}</span>
                  </div>
                  <span className="text-[#F5EFE6] text-sm font-medium">{dept} Dept</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#B0A090]">{dl.length} total</span>
                  <span className="text-[#4CAF7D]">{app} approved</span>
                </div>
              </div>
            );
          })}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}

// ─── Staff List ────────────────────────────────────────────────────────────────

export function AdminStaffList() {
  const { user } = useRequireAuth('admin');
  const navigate = useNavigate();
  const { staff, deleteStaff } = useHrmsStore();
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number; name: string } | null>(null);
  if (!user) return null;

  const handleDelete = () => {
    if (!deleteModal) return;
    deleteStaff(deleteModal.id);
    setDeleteModal(null);
  };

  return (
    <DashboardLayout role="admin" user={{ name: user.name, role: 'Administrator' }} title="Staff Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#F5EFE6] font-bold text-xl mb-1">All Staff</h2>
          <p className="text-[#7A6F65] text-sm">{staff.length} registered members</p>
        </div>
        <button onClick={() => navigate('/admin/staff/add')} className="btn-primary w-auto px-5 py-2.5">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <DataTable<StaffMember>
        data={staff}
        searchKeys={['name', 'employeeId', 'department', 'designation', 'email']}
        columns={[
          { key: 'name',        header: 'Name',       sortable: true, render: r => <span className="font-semibold">{r.name}</span> },
          { key: 'employeeId',  header: 'Employee ID' },
          { key: 'department',  header: 'Dept',       sortable: true },
          { key: 'designation', header: 'Designation', render: r => <span className="text-[#B0A090] text-xs">{r.designation}</span> },
          { key: 'role',        header: 'Role',       render: r => <span className="capitalize">{r.role}</span> },
          { key: 'joinDate',    header: 'Joined',     sortable: true, render: r => <span className="text-[#B0A090]">{formatDate(r.joinDate)}</span> },
        ]}
        emptyMessage="No staff records found."
        actions={r => (
          <div className="flex gap-2">
            <button onClick={() => navigate(`/admin/staff/edit/${r.id}`)}
              className="p-1.5 rounded-lg text-[#B0A090] hover:text-sand hover:bg-sand/10 transition-colors">
              <Edit3 size={15} />
            </button>
            <button onClick={() => setDeleteModal({ open: true, id: r.id, name: r.name })}
              className="p-1.5 rounded-lg text-[#B0A090] hover:text-[#E05C5C] hover:bg-[#E05C5C]/10 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        )}
      />

      <Modal
        open={deleteModal?.open ?? false}
        title="Delete Staff Record?"
        message={`Are you sure you want to delete ${deleteModal?.name}? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteModal(null)}
      />
    </DashboardLayout>
  );
}

// ─── Add / Edit Staff ────────────────────────────────────────────────────────

const DEPTS = [
  { id: 1, name: 'CSE' },
  { id: 2, name: 'ECE' },
  { id: 3, name: 'MECH' },
  { id: 4, name: 'CIVIL' },
  { id: 5, name: 'IT' },
];

interface StaffFormProps { mode: 'add' | 'edit'; staffId?: number; }

export function StaffForm({ mode, staffId }: StaffFormProps) {
  const { user } = useRequireAuth('admin');
  const navigate = useNavigate();
  const { staff, addStaff, editStaff } = useHrmsStore();
  const existing = staffId ? staff.find(s => s.id === staffId) : undefined;

  const [form, setForm] = useState({
    name: existing?.name ?? '',
    employeeId: existing?.employeeId ?? '',
    email: existing?.email ?? '',
    phone: existing?.phone ?? '',
    role: existing?.role ?? 'staff',
    department: existing?.department ?? 'CSE',
    departmentId: existing?.departmentId ?? 1,
    designation: existing?.designation ?? '',
    joinDate: existing?.joinDate ?? new Date().toISOString().split('T')[0],
    casualBalance:   existing?.casualBalance ?? 15,
    sickBalance:     existing?.sickBalance ?? 10,
    academicBalance: existing?.academicBalance ?? 5,
    dutyBalance:     existing?.dutyBalance ?? 3,
  });

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'add') {
      addStaff(form);
    } else if (staffId) {
      editStaff(staffId, form);
    }
    navigate('/admin/staff');
  };

  if (!user) return null;

  return (
    <DashboardLayout role="admin" user={{ name: user.name, role: 'Administrator' }} title={mode === 'add' ? 'Add Staff' : 'Edit Staff'}>
      <div className="max-w-2xl">
        <h2 className="text-[#F5EFE6] font-bold text-xl mb-6">{mode === 'add' ? 'Register New Staff Member' : `Edit: ${existing?.name}`}</h2>
        <GlassCard hover={false} className="p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="input-label">Full Name *</label><input required value={form.name} onChange={e=>set('name',e.target.value)} className="input-field" placeholder="Dr. John Doe" /></div>
              <div><label className="input-label">Employee ID *</label><input required value={form.employeeId} onChange={e=>set('employeeId',e.target.value)} className="input-field" placeholder="AGM-CSE-001" /></div>
              <div><label className="input-label">Email *</label><input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} className="input-field" /></div>
              <div><label className="input-label">Phone</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} className="input-field" placeholder="9876543210" /></div>
              <div>
                <label className="input-label">Department *</label>
                <select value={form.department} onChange={e => { const d = DEPTS.find(d=>d.name===e.target.value); set('department', e.target.value); if(d) set('departmentId', d.id); }} className="input-field">
                  {DEPTS.map(d => <option key={d.id} value={d.name} style={{ background: '#122324' }}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Role</label>
                <select value={form.role} onChange={e=>set('role',e.target.value)} className="input-field">
                  {['staff','hod'].map(r => <option key={r} value={r} style={{ background: '#122324' }} className="capitalize">{r.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="col-span-2"><label className="input-label">Designation *</label><input required value={form.designation} onChange={e=>set('designation',e.target.value)} className="input-field" placeholder="Assistant Professor" /></div>
              <div><label className="input-label">Join Date</label><input type="date" value={form.joinDate} onChange={e=>set('joinDate',e.target.value)} className="input-field" /></div>
            </div>

            <div className="border-t border-[rgba(219,159,117,0.12)] pt-5">
              <h4 className="text-[#F5EFE6] font-semibold text-sm mb-4">Leave Balances</h4>
              <div className="grid grid-cols-4 gap-3">
                {(['casualBalance','sickBalance','academicBalance','dutyBalance'] as const).map(k => (
                  <div key={k}>
                    <label className="input-label">{k.replace('Balance','').charAt(0).toUpperCase()+k.replace('Balance','').slice(1)}</label>
                    <input type="number" min={0} max={30} value={form[k]} onChange={e=>set(k, Number(e.target.value))} className="input-field" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/admin/staff')} className="btn-secondary w-auto px-5">Cancel</button>
              <button type="submit" className="btn-primary">{mode === 'add' ? 'Add Staff Member' : 'Save Changes'}</button>
            </div>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}

// ─── Calendar Manager ─────────────────────────────────────────────────────────

export function CalendarManager() {
  const { user } = useRequireAuth('admin');
  const { holidays, addHoliday, deleteHoliday } = useHrmsStore();
  const [form, setForm] = useState({ date: '', description: '', type: 'holiday' as Holiday['type'] });
  const [msg, setMsg] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number; desc: string } | null>(null);
  if (!user) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.description) return;
    if (holidays.find(h => h.date === form.date)) { setMsg('A holiday already exists on this date.'); return; }
    addHoliday(form);
    setForm({ date: '', description: '', type: 'holiday' });
    setMsg('Holiday added!');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <DashboardLayout role="admin" user={{ name: user.name, role: 'Administrator' }} title="Holiday Calendar">
      <h2 className="text-[#F5EFE6] font-bold text-xl mb-6">Manage Holiday Calendar</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hover={false} className="p-6">
          <h3 className="text-[#F5EFE6] font-bold text-base mb-5">Add Holiday / Term Date</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div><label className="input-label">Date *</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="input-field" required /></div>
            <div><label className="input-label">Description *</label><input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="input-field" placeholder="Republic Day" required /></div>
            <div>
              <label className="input-label">Type</label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as Holiday['type']}))} className="input-field">
                <option value="holiday" style={{background:'#122324'}}>Holiday</option>
                <option value="term_start" style={{background:'#122324'}}>Term Start</option>
                <option value="term_end" style={{background:'#122324'}}>Term End</option>
              </select>
            </div>
            {msg && <p className={`text-sm ${msg.includes('already') ? 'text-[#E05C5C]' : 'text-[#4CAF7D]'}`}>{msg}</p>}
            <button type="submit" className="btn-primary">+ Add Entry</button>
          </form>
        </GlassCard>

        <div className="lg:col-span-2">
          <DataTable<Holiday>
            data={holidays}
            columns={[
              { key: 'date',        header: 'Date',        sortable: true, render: r => formatDate(r.date) },
              { key: 'description', header: 'Description', render: r => <span className="font-medium">{r.description}</span> },
              { key: 'type',        header: 'Type',        render: r => (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  r.type === 'holiday' ? 'bg-[#E8A838]/15 text-[#E8A838] border-[#E8A838]/30' :
                  r.type === 'term_start' ? 'bg-[#4CAF7D]/15 text-[#4CAF7D] border-[#4CAF7D]/30' :
                  'bg-[#5B9BD5]/15 text-[#5B9BD5] border-[#5B9BD5]/30'
                }`}>{r.type.replace('_',' ')}</span>
              )},
            ]}
            actions={r => (
              <button onClick={() => setDeleteModal({ open: true, id: r.id, desc: r.description })}
                className="p-1.5 rounded-lg text-[#B0A090] hover:text-[#E05C5C] hover:bg-[#E05C5C]/10 transition-colors">
                <Trash2 size={15} />
              </button>
            )}
            emptyMessage="No holidays added yet."
          />
        </div>
      </div>

      <Modal
        open={deleteModal?.open ?? false}
        title="Remove Holiday?"
        message={`Remove "${deleteModal?.desc}" from the calendar?`}
        variant="danger"
        confirmLabel="Remove"
        onConfirm={() => { if(deleteModal) deleteHoliday(deleteModal.id); setDeleteModal(null); }}
        onClose={() => setDeleteModal(null)}
      />
    </DashboardLayout>
  );
}

// ─── Admin Reports ─────────────────────────────────────────────────────────────

export function AdminReports() {
  const { user } = useRequireAuth('admin');
  const { leaves } = useHrmsStore();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dept, setDept] = useState('all');
  const [status, setStatus] = useState('all');
  if (!user) return null;

  const depts = [...new Set(leaves.map(l => l.department))];
  const filtered = leaves.filter(l => {
    const inRange  = (!from || l.fromDate >= from) && (!to || l.toDate <= to);
    const inDept   = dept === 'all' || l.department === dept;
    const inStatus = status === 'all' || l.status === status;
    return inRange && inDept && inStatus;
  });

  const handleExport = () => {
    const csv = ['Staff,Dept,Type,From,To,Days,Status,HOD Remark,Principal Remark',
      ...filtered.map(l => `${l.userName},${l.department},${l.leaveType},${l.fromDate},${l.toDate},${l.days},${l.status},"${l.hodRemarks??''}","${l.principalRemarks??''}"`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'admin_leave_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="admin" user={{ name: user.name, role: 'Administrator' }} title="Leave Reports">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#F5EFE6] font-bold text-xl">Institution-Wide Leave Report</h2>
        <button onClick={handleExport} className="btn-primary w-auto px-5 py-2.5">↓ Export CSV</button>
      </div>
      <GlassCard hover={false} className="p-5 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="input-label">From</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="input-field" /></div>
          <div><label className="input-label">To</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="input-field" /></div>
          <div>
            <label className="input-label">Department</label>
            <select value={dept} onChange={e=>setDept(e.target.value)} className="input-field">
              <option value="all" style={{background:'#122324'}}>All</option>
              {depts.map(d=><option key={d} value={d} style={{background:'#122324'}}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} className="input-field">
              <option value="all" style={{background:'#122324'}}>All</option>
              {['pending_hod','pending_principal','approved','rejected'].map(s=><option key={s} value={s} style={{background:'#122324'}}>{s.replace(/_/g,' ')}</option>)}
            </select>
          </div>
        </div>
        <p className="text-[#7A6F65] text-xs mt-3">{filtered.length} records</p>
      </GlassCard>
      <DataTable<Leave>
        data={filtered}
        searchKeys={['userName','department','leaveType']}
        columns={[
          { key:'userName',   header:'Staff',    sortable:true, render:r=><span className="font-semibold">{r.userName}</span> },
          { key:'department', header:'Dept',     sortable:true },
          { key:'leaveType',  header:'Type',     render:r=><span className="capitalize">{r.leaveType}</span> },
          { key:'fromDate',   header:'From',     sortable:true, render:r=>formatDate(r.fromDate) },
          { key:'days',       header:'Days',     render:r=>`${r.days}d` },
          { key:'status',     header:'Status',   render:r=><StatusBadge status={r.status==='approved'?'approved':r.status==='rejected'?'rejected':r.status==='pending_principal'?'forwarded':'pending'} /> },
        ]}
        emptyMessage="No records match filters."
      />
    </DashboardLayout>
  );
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export function ResetPassword({ type }: { type: 'staff' | 'hod' }) {
  const { user } = useRequireAuth('admin');
  const { staff, resetPassword } = useHrmsStore();
  const [selected, setSelected] = useState<number | null>(null);
  const [modal, setModal] = useState(false);
  const [msg, setMsg] = useState('');
  if (!user) return null;

  const members = staff.filter(s => s.role === type);
  const selectedMember = staff.find(s => s.id === selected);

  const handleReset = () => {
    if (!selected) return;
    resetPassword(selected);
    setMsg(`Password for ${selectedMember?.name} has been reset to their Employee ID.`);
    setModal(false);
    setSelected(null);
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <DashboardLayout role="admin" user={{ name: user.name, role: 'Administrator' }} title={`Reset ${type.toUpperCase()} Password`}>
      <div className="max-w-lg">
        <h2 className="text-[#F5EFE6] font-bold text-xl mb-2">Reset {type === 'staff' ? 'Staff' : 'HOD'} Password</h2>
        <p className="text-[#7A6F65] text-sm mb-6">Select a member to reset their password to their Employee ID.</p>

        <GlassCard hover={false} className="p-6">
          <div className="space-y-2">
            {members.map(m => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  selected === m.id ? 'border-sand/40 bg-sand/10' : 'border-[rgba(219,159,117,0.12)] hover:border-sand/25 hover:bg-sand/5'
                }`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-copper to-deep flex items-center justify-center shrink-0">
                  <span className="text-sand text-xs font-bold">{m.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</span>
                </div>
                <div>
                  <p className="text-[#F5EFE6] text-sm font-semibold">{m.name}</p>
                  <p className="text-[#7A6F65] text-xs">{m.employeeId} · {m.department}</p>
                </div>
              </button>
            ))}
          </div>

          {msg && <p className="text-[#4CAF7D] text-sm mt-4 font-medium">{msg}</p>}

          <button
            disabled={!selected}
            onClick={() => setModal(true)}
            className="btn-primary mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw size={16} /> Reset Password
          </button>
        </GlassCard>
      </div>

      <Modal
        open={modal}
        title="Reset Password?"
        message={`Reset password for ${selectedMember?.name}? Their new password will be their Employee ID: ${selectedMember?.employeeId}`}
        variant="danger"
        confirmLabel="Reset Password"
        onConfirm={handleReset}
        onClose={() => setModal(false)}
      />
    </DashboardLayout>
  );
}

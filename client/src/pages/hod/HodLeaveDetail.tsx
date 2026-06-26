import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';
import { ArrowLeft, CheckCircle2, XCircle, Calendar, FileText, Users, Clock } from 'lucide-react';

export default function HodLeaveDetail() {
  const { id } = useParams();
  const { user } = useRequireAuth('hod');
  const navigate = useNavigate();
  const { leaves, adjustments, updateLeaveStatus, addNotification } = useHrmsStore();
  const [modal, setModal] = useState<{ open: boolean; action: 'approve' | 'reject'; remarks: string } | null>(null);

  if (!user) return null;
  const leave = leaves.find(l => l.id === Number(id));
  if (!leave) return (
    <DashboardLayout role="hod" user={{ name: user.name, role: user.designation ?? 'HOD', dept: user.department }} title="Leave Detail">
      <p className="text-[#7A6F65]">Leave not found.</p>
    </DashboardLayout>
  );

  const adj = adjustments.find(a => a.leaveId === leave.id);
  const canAct = leave.status === 'pending_hod';

  const handleAction = () => {
    if (!modal) return;
    if (modal.action === 'approve') {
      updateLeaveStatus(leave.id, 'pending_principal', modal.remarks, 'hod');
      addNotification({ userId: leave.userId, message: 'Your leave was approved by HOD', sub: `${leave.leaveType} leave · forwarded to Principal`, isRead: false, type: 'forwarded' });
      addNotification({ userId: 2, message: `${leave.userName} leave forwarded by HOD`, sub: `${leave.leaveType} leave · ${formatDate(leave.fromDate)}`, isRead: false, type: 'forwarded' });
    } else {
      updateLeaveStatus(leave.id, 'rejected', modal.remarks, 'hod');
      addNotification({ userId: leave.userId, message: 'Your leave was rejected by HOD', sub: modal.remarks || 'No remarks provided', isRead: false, type: 'rejected' });
    }
    setModal(null);
    navigate('/hod/leaves');
  };

  return (
    <DashboardLayout role="hod" user={{ name: user.name, role: user.designation ?? 'HOD', dept: user.department }} title="Leave Detail">
      <div className="max-w-3xl">
        <button onClick={() => navigate('/hod/leaves')} className="flex items-center gap-2 text-[#B0A090] hover:text-sand transition-colors text-sm mb-6">
          <ArrowLeft size={16} /> Back to Leave List
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-[#F5EFE6] font-bold text-xl mb-1">{leave.userName}'s Leave Application</h2>
            <div className="flex items-center gap-3">
              <StatusBadge status={leave.status === 'approved' ? 'approved' : leave.status === 'rejected' ? 'rejected' : leave.status === 'pending_principal' ? 'forwarded' : 'pending'} />
              <span className="text-[#7A6F65] text-xs">Applied {formatDate(leave.appliedAt)}</span>
            </div>
          </div>
          {canAct && (
            <div className="flex gap-2">
              <button onClick={() => setModal({ open: true, action: 'approve', remarks: '' })}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4CAF7D]/15 text-[#4CAF7D] border border-[#4CAF7D]/25 text-sm font-semibold hover:bg-[#4CAF7D]/25 transition-colors">
                <CheckCircle2 size={16} /> Approve
              </button>
              <button onClick={() => setModal({ open: true, action: 'reject', remarks: '' })}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E05C5C]/10 text-[#E05C5C] border border-[#E05C5C]/25 text-sm font-semibold hover:bg-[#E05C5C]/20 transition-colors">
                <XCircle size={16} /> Reject
              </button>
            </div>
          )}
        </div>

        {/* Leave Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <GlassCard hover={false} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-sand" />
              <h3 className="text-[#F5EFE6] font-bold text-sm">Leave Details</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Leave Type', value: `${leave.leaveType.charAt(0).toUpperCase()}${leave.leaveType.slice(1)} Leave` },
                { label: 'From',       value: formatDate(leave.fromDate) },
                { label: 'To',         value: formatDate(leave.toDate) },
                { label: 'Duration',   value: `${leave.days} working day${leave.days !== 1 ? 's' : ''}` },
                { label: 'Department', value: leave.department },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-[#7A6F65]">{item.label}</span>
                  <span className="text-[#F5EFE6] font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-sand" />
              <h3 className="text-[#F5EFE6] font-bold text-sm">Reason</h3>
            </div>
            <p className="text-[#B0A090] text-sm leading-relaxed">{leave.reason}</p>

            {leave.hodRemarks && (
              <div className="mt-4 p-3 rounded-xl bg-[rgba(18,35,36,0.5)] border border-[rgba(219,159,117,0.08)]">
                <p className="text-[#7A6F65] text-[10px] uppercase tracking-wider mb-1">HOD Remarks</p>
                <p className="text-[#F5EFE6] text-sm">{leave.hodRemarks}</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Class Adjustment */}
        <GlassCard hover={false} className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-sand" />
            <h3 className="text-[#F5EFE6] font-bold text-sm">Class Adjustment</h3>
          </div>
          {!leave.hasAdjustment ? (
            <p className="text-[#545748] text-sm">No class adjustment required for this leave.</p>
          ) : adj ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Adjuster',  value: adj.adjusterName },
                { label: 'Period',    value: adj.period },
                { label: 'Subject',   value: adj.subject },
                { label: 'Status',    value: adj.status.charAt(0).toUpperCase() + adj.status.slice(1) },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-[rgba(18,35,36,0.5)] border border-[rgba(219,159,117,0.08)]">
                  <p className="text-[#7A6F65] text-[10px] uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`text-sm font-medium ${item.label === 'Status'
                    ? adj.status === 'accepted' ? 'text-[#4CAF7D]' : adj.status === 'rejected' ? 'text-[#E05C5C]' : 'text-[#E8A838]'
                    : 'text-[#F5EFE6]'}`}>{item.value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#E8A838]">
              <Clock size={16} />
              <p className="text-sm">Adjustment request pending colleague response.</p>
            </div>
          )}
        </GlassCard>
      </div>

      <Modal
        open={modal?.open ?? false}
        title={modal?.action === 'approve' ? 'Approve Leave Application?' : 'Reject Leave Application?'}
        message={modal?.action === 'approve'
          ? 'This leave will be forwarded to the Principal for final approval.'
          : 'The staff member will be notified of the rejection.'}
        variant={modal?.action === 'approve' ? 'approve' : 'reject'}
        confirmLabel={modal?.action === 'approve' ? 'Approve & Forward' : 'Reject'}
        remarks={modal?.remarks ?? ''}
        onRemarksChange={v => setModal(m => m ? { ...m, remarks: v } : null)}
        remarksLabel="HOD Remarks"
        onConfirm={handleAction}
        onClose={() => setModal(null)}
      />
    </DashboardLayout>
  );
}

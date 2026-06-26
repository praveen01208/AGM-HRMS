import { useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { GlassCard } from '../../components/GlassCard';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/StatusBadge';
import { useRequireAuth } from '../../hooks/useAuth';
import { useHrmsStore } from '../../store/hrmsStore';
import { formatDate } from '../../utils/dateUtils';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AdjustmentRespond() {
  const { user } = useRequireAuth('staff');
  const { adjustments, respondAdjustment, addNotification } = useHrmsStore();
  const [modal, setModal] = useState<{ open: boolean; adjId: number; action: 'accepted' | 'rejected' } | null>(null);

  if (!user) return null;

  const incoming = adjustments.filter(a => a.adjusterId === user.id);

  const handleConfirm = () => {
    if (!modal) return;
    respondAdjustment(modal.adjId, modal.action);
    const adj = adjustments.find(a => a.id === modal.adjId);
    if (adj) {
      addNotification({
        userId: adj.requesterId,
        message: `${user.name} ${modal.action} your adjustment request`,
        sub: `${adj.subject} · ${adj.period} · ${adj.date}`,
        isRead: false,
        type: modal.action === 'accepted' ? 'approved' : 'rejected',
      });
    }
    setModal(null);
  };

  return (
    <DashboardLayout role="staff" user={{ name: user.name, role: user.designation ?? 'Staff', dept: user.department }} title="Adjustment Requests">
      <div className="mb-6">
        <h2 className="text-[#F5EFE6] font-bold text-xl mb-1">Incoming Adjustment Requests</h2>
        <p className="text-[#7A6F65] text-sm">Requests from colleagues for you to cover their class</p>
      </div>

      {incoming.length === 0 ? (
        <GlassCard hover={false} className="p-12 text-center">
          <Clock size={40} className="text-[#545748] mx-auto mb-3" />
          <p className="text-[#7A6F65] font-medium">No adjustment requests at this time.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {incoming.map(a => (
            <GlassCard key={a.id} hover={false} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-copper to-deep flex items-center justify-center shrink-0">
                      <span className="text-sand text-xs font-bold">{a.requesterName.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
                    </div>
                    <div>
                      <p className="text-[#F5EFE6] font-bold text-sm">{a.requesterName}</p>
                      <p className="text-[#7A6F65] text-xs">Requesting class coverage</p>
                    </div>
                    <div className="ml-auto">
                      <StatusBadge status={a.status === 'accepted' ? 'approved' : a.status === 'rejected' ? 'rejected' : 'pending'} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Date',    value: formatDate(a.date) },
                      { label: 'Period',  value: a.period },
                      { label: 'Subject', value: a.subject },
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-xl bg-[rgba(18,35,36,0.5)] border border-[rgba(219,159,117,0.08)]">
                        <p className="text-[#7A6F65] text-[10px] uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                        <p className="text-[#F5EFE6] text-sm font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {a.respondedAt && (
                    <p className="text-[#545748] text-xs mt-3">Responded: {formatDate(a.respondedAt)}</p>
                  )}
                </div>

                {a.status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setModal({ open: true, adjId: a.id, action: 'accepted' })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4CAF7D]/15 text-[#4CAF7D] border border-[#4CAF7D]/25 text-sm font-semibold hover:bg-[#4CAF7D]/25 transition-colors"
                    >
                      <CheckCircle2 size={15} /> Accept
                    </button>
                    <button
                      onClick={() => setModal({ open: true, adjId: a.id, action: 'rejected' })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E05C5C]/10 text-[#E05C5C] border border-[#E05C5C]/25 text-sm font-semibold hover:bg-[#E05C5C]/20 transition-colors"
                    >
                      <XCircle size={15} /> Decline
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal
        open={modal?.open ?? false}
        title={modal?.action === 'accepted' ? 'Accept Adjustment Request?' : 'Decline Adjustment Request?'}
        message={modal?.action === 'accepted'
          ? 'You are confirming that you will cover this class. The leave application will be forwarded to the HOD.'
          : 'The colleague will be notified that you cannot cover this class.'}
        variant={modal?.action === 'accepted' ? 'approve' : 'reject'}
        confirmLabel={modal?.action === 'accepted' ? 'Accept' : 'Decline'}
        onConfirm={handleConfirm}
        onClose={() => setModal(null)}
      />
    </DashboardLayout>
  );
}

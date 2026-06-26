import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar, FileText, Users } from 'lucide-react';
import { useHrmsStore, type LeaveType } from '../../store/hrmsStore';
import { useAuthStore } from '../../store/authStore';
import { StepIndicator } from '../StepIndicator';
import { GlassCard } from '../GlassCard';
import { daysBetween, todayISO } from '../../utils/dateUtils';
import { MOCK_USERS_PUBLIC } from '../../store/authStore';

const LEAVE_TYPES: { value: LeaveType; label: string; desc: string }[] = [
  { value: 'casual',   label: 'Casual Leave',   desc: 'Personal / family reasons' },
  { value: 'sick',     label: 'Sick Leave',     desc: 'Medical / health related' },
  { value: 'academic', label: 'Academic Leave', desc: 'Conferences, workshops, FDP' },
  { value: 'duty',     label: 'Duty Leave',     desc: 'External exam, official duty' },
];

const PERIODS = ['1st Period', '2nd Period', '3rd Period', '4th Period', '5th Period', '6th Period'];

export const LeaveWizard: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { applyLeave, addAdjustment, addNotification } = useHrmsStore();

  const [step, setStep] = useState(0);

  // Step 1 state
  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate]   = useState('');

  // Step 2 state
  const [reason, setReason] = useState('');

  // Step 3 state (conditional)
  const [needAdjustment, setNeedAdjustment] = useState(false);
  const [adjPeer, setAdjPeer]   = useState('');
  const [adjPeriod, setAdjPeriod] = useState('');
  const [adjSubject, setAdjSubject] = useState('');

  const days = fromDate && toDate ? daysBetween(fromDate, toDate) : 0;
  const isWorkingDay = days > 0;

  // Colleagues in same dept (exclude self)
  const colleagues = MOCK_USERS_PUBLIC.filter(
    u => u.role === 'staff' && u.departmentId === user?.departmentId && u.id !== user?.id
  );

  const stepDefs = [
    { label: 'Leave Details', status: step > 0 ? 'done' : step === 0 ? 'active' : 'inactive' },
    { label: 'Reason',        status: step > 1 ? 'done' : step === 1 ? 'active' : 'inactive' },
    { label: 'Adjustment',    status: step > 2 ? 'done' : step === 2 ? 'active' : 'inactive' },
  ] as const;

  const handleSubmit = () => {
    if (!user) return;
    const leaveId = applyLeave({
      userId: user.id,
      userName: user.name,
      department: user.department ?? '',
      departmentId: user.departmentId ?? 0,
      leaveType,
      fromDate,
      toDate,
      days,
      reason,
      status: needAdjustment ? 'pending_adjustment' : 'pending_hod',
      hasAdjustment: needAdjustment,
    });

    if (needAdjustment && adjPeer) {
      const peerUser = MOCK_USERS_PUBLIC.find(u => String(u.id) === adjPeer);
      addAdjustment({
        leaveId,
        requesterId: user.id,
        requesterName: user.name,
        adjusterId: Number(adjPeer),
        adjusterName: peerUser?.name ?? '',
        period: adjPeriod,
        subject: adjSubject,
        date: fromDate,
        status: 'pending',
      });
      addNotification({ userId: Number(adjPeer), message: `${user.name} requests class adjustment`, sub: `${adjSubject} · ${adjPeriod}`, isRead: false, type: 'pending' });
    }

    addNotification({ userId: user.id, message: 'Leave application submitted', sub: `${leaveType} · ${fromDate} to ${toDate}`, isRead: false, type: 'pending' });
    onSuccess ? onSuccess() : navigate('/staff/leave/status');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <StepIndicator steps={stepDefs.map(s => ({ label: s.label, status: s.status as 'active' | 'done' | 'inactive' }))} />
      </div>

      {/* Step 1: Leave Details */}
      {step === 0 && (
        <GlassCard hover={false} className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Calendar size={20} className="text-sand" />
            <h3 className="text-[#F5EFE6] font-bold text-lg">Leave Details</h3>
          </div>

          <div className="mb-6">
            <label className="input-label">Leave Type</label>
            <div className="grid grid-cols-2 gap-3">
              {LEAVE_TYPES.map(lt => (
                <button
                  key={lt.value}
                  type="button"
                  onClick={() => setLeaveType(lt.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    leaveType === lt.value
                      ? 'border-sand/50 bg-sand/10 text-[#F5EFE6]'
                      : 'border-[rgba(219,159,117,0.15)] text-[#B0A090] hover:border-sand/30 hover:bg-sand/5'
                  }`}
                >
                  <p className="font-semibold text-sm">{lt.label}</p>
                  <p className="text-[10px] mt-0.5 text-[#7A6F65]">{lt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="input-label">From Date</label>
              <input type="date" min={todayISO()} value={fromDate} onChange={e => setFromDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="input-label">To Date</label>
              <input type="date" min={fromDate || todayISO()} value={toDate} onChange={e => setToDate(e.target.value)} className="input-field" />
            </div>
          </div>

          {days > 0 && (
            <div className="p-4 rounded-xl bg-[rgba(219,159,117,0.08)] border border-[rgba(219,159,117,0.2)] mb-6">
              <p className="text-sand text-sm font-semibold">{days} working day{days !== 1 ? 's' : ''} selected</p>
              <p className="text-[#7A6F65] text-xs mt-0.5">{fromDate} → {toDate}</p>
            </div>
          )}

          <button
            className="btn-primary"
            disabled={!fromDate || !toDate || days === 0}
            onClick={() => setStep(1)}
          >
            Next: Reason <ChevronRight size={16} />
          </button>
        </GlassCard>
      )}

      {/* Step 2: Reason */}
      {step === 1 && (
        <GlassCard hover={false} className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText size={20} className="text-sand" />
            <h3 className="text-[#F5EFE6] font-bold text-lg">Reason & Remarks</h3>
          </div>

          <div className="mb-6">
            <label className="input-label">Reason for Leave *</label>
            <textarea
              rows={5}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Describe the reason for your leave application…"
              className="input-field resize-none"
            />
          </div>

          {isWorkingDay && (
            <div className="mb-6 p-4 rounded-xl bg-[rgba(18,35,36,0.6)] border border-[rgba(219,159,117,0.15)]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needAdjustment}
                  onChange={e => setNeedAdjustment(e.target.checked)}
                  className="w-4 h-4 accent-copper"
                />
                <div>
                  <p className="text-[#F5EFE6] text-sm font-semibold">Request Class Adjustment</p>
                  <p className="text-[#7A6F65] text-xs">Ask a colleague to cover your class during this period</p>
                </div>
              </label>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary w-auto px-5">
              <ChevronLeft size={16} /> Back
            </button>
            <button className="btn-primary" disabled={!reason.trim()} onClick={() => needAdjustment ? setStep(2) : handleSubmit()}>
              {needAdjustment ? (<>Next: Adjustment <ChevronRight size={16} /></>) : (<>Submit Application <CheckCircle2 size={16} /></>)}
            </button>
          </div>
        </GlassCard>
      )}

      {/* Step 3: Class Adjustment */}
      {step === 2 && (
        <GlassCard hover={false} className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Users size={20} className="text-sand" />
            <h3 className="text-[#F5EFE6] font-bold text-lg">Class Adjustment</h3>
          </div>

          <div className="mb-5">
            <label className="input-label">Select Colleague (Adjuster) *</label>
            <select value={adjPeer} onChange={e => setAdjPeer(e.target.value)} className="input-field">
              <option value="" style={{ background: '#122324' }}>Select a colleague…</option>
              {colleagues.map(c => (
                <option key={c.id} value={String(c.id)} style={{ background: '#122324' }}>{c.name} — {c.designation}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="input-label">Period *</label>
              <select value={adjPeriod} onChange={e => setAdjPeriod(e.target.value)} className="input-field">
                <option value="" style={{ background: '#122324' }}>Select period…</option>
                {PERIODS.map(p => <option key={p} value={p} style={{ background: '#122324' }}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Subject *</label>
              <input value={adjSubject} onChange={e => setAdjSubject(e.target.value)} placeholder="e.g. Data Structures" className="input-field" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary w-auto px-5">
              <ChevronLeft size={16} /> Back
            </button>
            <button
              className="btn-primary"
              disabled={!adjPeer || !adjPeriod || !adjSubject}
              onClick={handleSubmit}
            >
              Submit Application <CheckCircle2 size={16} />
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

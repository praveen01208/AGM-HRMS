import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

type ModalVariant = 'confirm' | 'approve' | 'reject' | 'danger';

interface ModalProps {
  open: boolean;
  title: string;
  message?: string;
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  remarks?: string;
  onRemarksChange?: (v: string) => void;
  remarksLabel?: string;
  remarksRequired?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const variantConfig = {
  confirm:  { icon: AlertTriangle,  iconColor: 'text-[#E8A838]', btnClass: 'bg-gradient-to-r from-copper to-deep hover:shadow-copper' },
  approve:  { icon: CheckCircle2,   iconColor: 'text-[#4CAF7D]', btnClass: 'bg-[#4CAF7D] hover:bg-[#3d9e6b]' },
  reject:   { icon: XCircle,        iconColor: 'text-[#E05C5C]', btnClass: 'bg-[#E05C5C] hover:bg-[#c94a4a]' },
  danger:   { icon: AlertTriangle,  iconColor: 'text-[#E05C5C]', btnClass: 'bg-[#E05C5C] hover:bg-[#c94a4a]' },
};

export const Modal: React.FC<ModalProps> = ({
  open, title, message, variant = 'confirm', confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  remarks = '', onRemarksChange, remarksLabel = 'Remarks', remarksRequired = false,
  onConfirm, onClose,
}) => {
  const { icon: Icon, iconColor, btnClass } = variantConfig[variant];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card p-7 z-10">
        <button onClick={onClose} className="absolute top-5 right-5 text-[#7A6F65] hover:text-sand transition-colors">
          <X size={18} />
        </button>
        <div className="flex items-start gap-4 mb-5">
          <div className={`mt-0.5 shrink-0 ${iconColor}`}>
            <Icon size={24} strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-[#F5EFE6] font-bold text-base mb-1">{title}</h3>
            {message && <p className="text-[#B0A090] text-sm leading-relaxed">{message}</p>}
          </div>
        </div>

        {onRemarksChange !== undefined && (
          <div className="mb-6">
            <label className="input-label">{remarksLabel}{remarksRequired ? ' *' : ''}</label>
            <textarea
              value={remarks}
              onChange={e => onRemarksChange(e.target.value)}
              rows={3}
              placeholder="Enter remarks…"
              className="input-field resize-none"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary px-5 py-2.5 text-sm w-auto">
            {cancelLabel}
          </button>
          <button
            onClick={() => { if (remarksRequired && !remarks.trim()) return; onConfirm(); }}
            className={`px-5 py-2.5 rounded-[10px] text-[#F5EFE6] font-semibold text-sm transition-all ${btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

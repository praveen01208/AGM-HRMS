import React from 'react';

type StatusType = 'approved' | 'pending' | 'rejected' | 'forwarded';

interface StatusBadgeProps {
  status: StatusType;
}

const statusStyles: Record<StatusType, string> = {
  approved:  'bg-[#4CAF7D]/15 text-[#4CAF7D] border border-[#4CAF7D]/30',
  pending:   'bg-[#E8A838]/15 text-[#E8A838] border border-[#E8A838]/30',
  rejected:  'bg-[#E05C5C]/15 text-[#E05C5C] border border-[#E05C5C]/30',
  forwarded: 'bg-[#5B9BD5]/15 text-[#5B9BD5] border border-[#5B9BD5]/30',
};

const statusDots: Record<StatusType, string> = {
  approved:  'bg-[#4CAF7D]',
  pending:   'bg-[#E8A838]',
  rejected:  'bg-[#E05C5C]',
  forwarded: 'bg-[#5B9BD5]',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${statusDots[status]}`} />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;

import React from 'react';
import { Check } from 'lucide-react';

type StepStatus = 'active' | 'done' | 'inactive';

interface Step {
  label: string;
  status: StepStatus;
}

interface StepIndicatorProps {
  steps: Step[];
}

const dotStyles: Record<StepStatus, string> = {
  active:   'bg-copper text-[#F5EFE6]',
  done:     'bg-[#4CAF7D] text-white',
  inactive: 'bg-[rgba(84,87,72,0.4)] text-[#7A6F65]',
};

const lineStyles: Record<StepStatus, string> = {
  done:     'bg-[#4CAF7D]',
  active:   'bg-[rgba(84,87,72,0.4)]',
  inactive: 'bg-[rgba(84,87,72,0.4)]',
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => (
  <div className="flex items-center w-full">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        {/* Step dot + label */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${dotStyles[step.status]}`}>
            {step.status === 'done' ? <Check size={14} strokeWidth={3} /> : i + 1}
          </div>
          <span className={`text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${
            step.status === 'active' ? 'text-sand' : step.status === 'done' ? 'text-[#4CAF7D]' : 'text-[#7A6F65]'
          }`}>
            {step.label}
          </span>
        </div>

        {/* Connecting line (not after last) */}
        {i < steps.length - 1 && (
          <div className={`flex-1 h-0.5 mx-3 ${lineStyles[steps[i + 1].status === 'done' ? 'done' : steps[i].status]}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default StepIndicator;

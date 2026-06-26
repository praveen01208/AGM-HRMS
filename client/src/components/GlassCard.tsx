import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true, onClick }) => (
  <div
    onClick={onClick}
    className={`
      glass-card
      ${hover ? 'hover:-translate-y-0.5 transition-all duration-250 cursor-pointer' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

export default GlassCard;

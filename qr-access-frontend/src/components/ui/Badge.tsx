import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'secondary';
  dot?: boolean;
}

const config = {
  success:   { bg: 'bg-[#ecfdf5]', text: 'text-[#059669]', border: 'border-[#a7f3d0]', dot: 'bg-[#10b981]' },
  warning:   { bg: 'bg-[#fffbeb]', text: 'text-[#d97706]', border: 'border-[#fde68a]', dot: 'bg-[#f59e0b]' },
  danger:    { bg: 'bg-[#fef2f2]', text: 'text-[#dc2626]', border: 'border-[#fecaca]', dot: 'bg-[#ef4444]' },
  info:      { bg: 'bg-[#eff6ff]', text: 'text-[#2563eb]', border: 'border-[#bfdbfe]', dot: 'bg-[#3b82f6]' },
  default:   { bg: 'bg-[#f8fafc]', text: 'text-[#64748b]', border: 'border-[#e2e8f0]', dot: 'bg-[#94a3b8]' },
  secondary: { bg: 'bg-[#f5f3ff]', text: 'text-[#7c3aed]', border: 'border-[#ddd6fe]', dot: 'bg-[#8b5cf6]' },
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', dot = true }) => {
  const c = config[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />}
      {children}
    </span>
  );
};
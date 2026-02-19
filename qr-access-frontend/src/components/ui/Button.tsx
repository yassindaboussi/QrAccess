import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none whitespace-nowrap';

  const variants = {
    primary:
      'bg-[#6366f1] text-white border-[#6366f1] hover:bg-[#4f46e5] shadow-[0_1px_2px_rgba(99,102,241,0.3),0_0_0_1px_rgba(99,102,241,0.1)] hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)] focus:ring-[#6366f1]',
    secondary:
      'bg-white text-[#475569] border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] shadow-[0_1px_2px_rgba(15,23,42,0.05)] focus:ring-[#6366f1]',
    danger:
      'bg-[#ef4444] text-white border-[#ef4444] hover:bg-[#dc2626] shadow-[0_1px_2px_rgba(239,68,68,0.3)] hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)] focus:ring-[#ef4444]',
    success:
      'bg-[#10b981] text-white border-[#10b981] hover:bg-[#059669] shadow-[0_1px_2px_rgba(16,185,129,0.3)] focus:ring-[#10b981]',
    ghost:
      'bg-transparent text-[#6366f1] border-transparent hover:bg-[#eef2ff] focus:ring-[#6366f1]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-sm gap-2',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Processing…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPadding = false,
}) => {
  return (
    <div
      className={`
        bg-white border border-[#e2e8f0] rounded-2xl
        shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.06)]
        overflow-hidden
        ${className}
      `}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-[#0f172a]">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#94a3b8] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'px-6 py-5'}>{children}</div>
    </div>
  );
};
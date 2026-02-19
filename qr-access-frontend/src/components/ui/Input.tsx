import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || generatedId}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#475569] mb-1.5 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full py-2.5 border rounded-xl text-sm text-[#0f172a] bg-white
              placeholder:text-[#cbd5e1] transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]
              shadow-[0_1px_2px_rgba(15,23,42,0.05)]
              ${icon ? 'pl-9 pr-3' : 'px-3.5'}
              ${error ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#ef4444] flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && <p className="mt-1.5 text-xs text-[#94a3b8]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
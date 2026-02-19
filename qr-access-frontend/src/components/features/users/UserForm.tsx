'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const userSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  subscription: z.object({
    duration: z.enum(['day', 'week', 'month', 'year', 'custom']),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: Partial<UserFormData>;
  isLoading?: boolean;
}

const durations = [
  { value: 'day',    label: 'Day' },
  { value: 'week',   label: 'Week' },
  { value: 'month',  label: 'Month' },
  { value: 'year',   label: 'Year' },
  { value: 'custom', label: 'Custom' },
];

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData, isLoading = false }) => {
  const [duration, setDuration] = useState<'day' | 'week' | 'month' | 'year' | 'custom'>(
    initialData?.subscription?.duration || 'month'
  );

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  const watchedStartDate = watch('subscription.startDate');

  const calcEnd = (dur: string, start?: string) => {
    const base = start ? new Date(start) : new Date();
    const end = new Date(base);
    if (dur === 'day')   end.setDate(end.getDate() + 1);
    if (dur === 'week')  end.setDate(end.getDate() + 7);
    if (dur === 'month') end.setMonth(end.getMonth() + 1);
    if (dur === 'year')  end.setFullYear(end.getFullYear() + 1);
    return end.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    if (duration !== 'custom' && watchedStartDate) {
      setValue('subscription.endDate', calcEnd(duration, watchedStartDate));
    }
  }, [duration, watchedStartDate]);

  const handleDurationChange = (d: typeof duration) => {
    setDuration(d);
    setValue('subscription.duration', d);
    if (d !== 'custom') {
      const start = watchedStartDate || new Date().toISOString().split('T')[0];
      setValue('subscription.startDate', start);
      setValue('subscription.endDate', calcEnd(d, start));
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 border border-[#e2e8f0] rounded-xl text-sm text-[#0f172a] bg-white placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name *" {...register('fullName')} error={errors.fullName?.message} placeholder="John Doe" />
        <Input label="Email" {...register('email')} error={errors.email?.message} placeholder="john@example.com" />
      </div>

      <Input label="Phone Number" {...register('phoneNumber')} placeholder="+1 (555) 000-0000" />

      {/* Duration selector */}
      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-2">Subscription Period</label>
        <div className="flex rounded-xl border border-[#e2e8f0] overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.05)] bg-[#f8fafc]">
          {durations.map((d, i) => (
            <button
              key={d.value}
              type="button"
              onClick={() => handleDurationChange(d.value as typeof duration)}
              className={`
                flex-1 py-2.5 text-xs font-semibold transition-all
                ${i > 0 ? 'border-l border-[#e2e8f0]' : ''}
                ${duration === d.value
                  ? 'bg-[#6366f1] text-white shadow-none z-10'
                  : 'text-[#64748b] hover:bg-white hover:text-[#334155]'
                }
              `}
            >
              {d.label}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('subscription.duration')} value={duration} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">Start Date</label>
          <input type="date" {...register('subscription.startDate')} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">
            End Date {duration !== 'custom' && <span className="text-[#94a3b8] font-normal">(auto)</span>}
          </label>
          <input
            type="date"
            {...register('subscription.endDate')}
            readOnly={duration !== 'custom'}
            className={`${inputClass} ${duration !== 'custom' ? 'opacity-60 cursor-not-allowed bg-[#f8fafc]' : ''}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5">Notes</label>
        <input
          {...register('subscription.notes')}
          placeholder="e.g. VIP, staff, visitor, gym member…"
          className={inputClass}
        />
      </div>

      <div className="pt-1">
        <Button type="submit" loading={isLoading} fullWidth size="lg">
          {isLoading ? 'Saving…' : initialData ? 'Save Changes' : 'Create Member'}
        </Button>
      </div>
    </form>
  );
};
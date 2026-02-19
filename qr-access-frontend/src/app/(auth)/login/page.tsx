'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { EnvelopeIcon, LockClosedIcon, QrCodeIcon, ShieldCheckIcon, BoltIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const features = [
  { icon: ShieldCheckIcon, label: 'Real-time access control', sub: 'Instant grant or deny decisions' },
  { icon: BoltIcon,        label: 'Instant QR verification', sub: 'Scan & verify in under a second' },
  { icon: ChartBarIcon,    label: 'Full audit history',       sub: 'Every scan logged automatically' },
];

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/users');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)',
        }}
      >
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Top — logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <QrCodeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">QR Access</p>
            <p className="text-xs text-white/50 tracking-wider">Control System</p>
          </div>
        </div>

        {/* Middle — headline */}
        <div className="relative">
          <p className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] mb-6">
            Smart access<br />
            <span className="text-white/60">starts here.</span>
          </p>
          <p className="text-sm text-white/60 leading-relaxed max-w-xs">
            Manage members, verify QR codes, and track every entry — all from one clean dashboard.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-4">
            {features.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-white/50">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="relative text-xs text-white/30">
          Authorized administrators only. All sessions are monitored.
        </p>
      </div>

      {/* ── Right — form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <QrCodeIcon className="w-5 h-5 text-white" />
          </div>
          <p className="text-base font-bold text-[#0f172a]">QR Access</p>
        </div>

        <div className="w-full max-w-[380px]">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Sign in to your account</h1>
            <p className="text-sm text-[#94a3b8]">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              icon={<EnvelopeIcon className="w-4 h-4" />}
              {...register('email')}
              error={errors.email?.message}
              placeholder="admin@example.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              icon={<LockClosedIcon className="w-4 h-4" />}
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <div className="pt-2">
              <Button type="submit" loading={isLoading} fullWidth size="lg">
                Sign in
              </Button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-[#cbd5e1]">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
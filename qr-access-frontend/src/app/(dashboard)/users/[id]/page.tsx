'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { UserQRCode } from '@/components/features/users/UserQRCode';
import { ScanHistory } from '@/components/features/scans/ScanHistory';
import { UserForm } from '@/components/features/users/UserForm';
import { useUser, useUsers } from '@/lib/hooks/useUsers';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatDate } from '@/lib/utils/format';
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PhoneIcon,
  FingerPrintIcon,
} from '@heroicons/react/24/outline';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, error } = useUser(id as string);
  const { updateUser, deleteUser } = useUsers({});
  const user = data?.data;
  const canEdit = authUser?.role === 'super_admin';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-[#e2e8f0] border-t-[#6366f1] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#fef2f2] flex items-center justify-center mb-4">
          <UserCircleIcon className="w-7 h-7 text-[#ef4444]" />
        </div>
        <h2 className="text-base font-semibold text-[#0f172a] mb-1">User not found</h2>
        <p className="text-sm text-[#94a3b8] mb-5">This user doesn't exist or you don't have permission.</p>
        <Button variant="secondary" onClick={() => router.push('/users')}>
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Members
        </Button>
      </div>
    );
  }

  const statusMap: Record<'active' | 'future' | 'expired' | 'none', { variant: any; label: string }> = {
    active:  { variant: 'success', label: 'Active' },
    future:  { variant: 'info',    label: 'Upcoming' },
    expired: { variant: 'danger',  label: 'Expired' },
    none:    { variant: 'default', label: 'No subscription' },
  };
  const statusKey = (user.subscriptionStatus ?? 'none') as 'active' | 'future' | 'expired' | 'none';
  const statusInfo = statusMap[statusKey] ?? { variant: 'default', label: 'No subscription' };

  const initials = user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase();

  const handleUpdate = async (data: any) => {
    await updateUser.mutateAsync({ id: user._id, data });
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    await deleteUser.mutateAsync(user._id);
    router.push('/users');
  };

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-xl border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:text-[#334155] hover:border-[#cbd5e1] transition-all shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold text-white shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-[#0f172a]">{user.fullName}</h1>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <p className="text-xs text-[#94a3b8] font-mono mt-0.5">#{user.uniqueCode}</p>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(true)}>
              <PencilSquareIcon className="w-3.5 h-3.5" />
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
              <TrashIcon className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left col ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info */}
          <Card title="Member Information" subtitle="Contact and identification details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: UserCircleIcon,   label: 'Full Name',    value: user.fullName },
                { icon: EnvelopeIcon,     label: 'Email',        value: user.email || 'Not provided' },
                { icon: PhoneIcon,        label: 'Phone',        value: user.phoneNumber || 'Not provided' },
                { icon: FingerPrintIcon,  label: 'Unique Code',  value: user.uniqueCode, mono: true },
                { icon: CalendarDaysIcon, label: 'Member Since', value: formatDate(user.createdAt) },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
                  <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#6366f1]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#94a3b8]">{label}</p>
                    <p className={`text-sm font-semibold text-[#334155] mt-0.5 truncate ${mono ? 'font-mono text-xs' : ''}`}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Subscription */}
          <Card title="Subscription" subtitle="Current membership plan details">
            {user.subscriptionEnd ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['Type',       (user.subscriptionType || 'Custom'), false],
                  ['Start Date', user.subscriptionStart ? formatDate(user.subscriptionStart) : 'Not set', false],
                  ['End Date',   formatDate(user.subscriptionEnd), false],
                  ['Notes',      user.subscriptionNotes || 'No notes', false],
                ].map(([label, value]) => (
                  <div key={label as string} className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
                    <p className="text-xs font-medium text-[#94a3b8] mb-1">{label as string}</p>
                    <p className="text-sm font-semibold text-[#334155] capitalize truncate" title={value as string}>
                      {value as string}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center mb-3">
                  <CalendarDaysIcon className="w-5 h-5 text-[#cbd5e1]" />
                </div>
                <p className="text-sm font-medium text-[#334155]">No subscription</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">This member has no active plan</p>
              </div>
            )}
          </Card>

          <ScanHistory userId={user._id} />
        </div>

        {/* ── Right col — QR ── */}
        <div>
          <Card title="QR Code" subtitle="Scan to verify access">
            <UserQRCode user={user} />
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Member" subtitle="Update member information and subscription">
        <UserForm
          initialData={{
            fullName: user.fullName,
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            subscription: {
              duration: user.subscriptionType || 'custom',
              startDate: user.subscriptionStart ? new Date(user.subscriptionStart).toISOString().split('T')[0] : '',
              endDate: user.subscriptionEnd ? new Date(user.subscriptionEnd).toISOString().split('T')[0] : '',
              notes: user.subscriptionNotes || '',
            },
          }}
          onSubmit={handleUpdate}
          isLoading={updateUser.isPending}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Member" subtitle="This action cannot be undone">
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3">
            <TrashIcon className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
            <p className="text-sm text-[#991b1b]">
              You are about to permanently delete <strong>{user.fullName}</strong> and all their data.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteUser.isPending}>
              <TrashIcon className="w-4 h-4" />
              Delete Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
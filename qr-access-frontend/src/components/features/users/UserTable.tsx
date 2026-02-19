'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { User } from '@/lib/types';
import { formatDate } from '@/lib/utils/format';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface UserTableProps {
  users: User[];
  onRowClick?: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onRowClick }) => {
  const router = useRouter();

  const columns = [
    {
      key: 'fullName',
      title: 'Member',
      render: (user: User) => {
        const initials = user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">{user.fullName}</p>
              {user.email && <p className="text-xs text-[#94a3b8] mt-0.5">{user.email}</p>}
            </div>
          </div>
        );
      },
    },
    {
      key: 'subscription',
      title: 'Status',
      render: (user: User) => {
        const status = user.subscriptionStatus || (user.hasActiveSubscription ? 'active' : 'expired');
        const map: Record<string, [any, string]> = {
          active:  ['success', 'Active'],
          future:  ['info',    'Upcoming'],
          expired: ['danger',  'Expired'],
        };
        const [variant, label] = map[status] || ['default', 'None'];
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: 'subscriptionStart',
      title: 'Start',
      render: (user: User) => (
        <span className="text-sm text-[#64748b]">
          {user.subscriptionStart ? formatDate(user.subscriptionStart) : '—'}
        </span>
      ),
    },
    {
      key: 'subscriptionEnd',
      title: 'Expires',
      render: (user: User) => (
        <span className="text-sm text-[#64748b]">
          {user.subscriptionEnd ? formatDate(user.subscriptionEnd) : '—'}
        </span>
      ),
    },
    {
      key: 'subscriptionNotes',
      title: 'Notes',
      render: (user: User) => (
        <span className="text-xs text-[#94a3b8] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-md">
          {user.subscriptionNotes || 'No notes'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Joined',
      render: (user: User) => (
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#94a3b8]">{formatDate(user.createdAt)}</span>
          <ChevronRightIcon className="w-4 h-4 text-[#cbd5e1] group-hover:text-[#6366f1] transition-colors ml-4" />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      onRowClick={onRowClick || ((user) => router.push(`/users/${user._id}`))}
    />
  );
};
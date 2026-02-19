'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UsersIcon,
  QrCodeIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import {
  UsersIcon as UsersSolid,
  QrCodeIcon as QrSolid,
  ClockIcon as ClockSolid,
} from '@heroicons/react/24/solid';
import { useAuth } from '@/lib/hooks/useAuth';

const navigation = [
  { name: 'Members', href: '/users', icon: UsersIcon, iconSolid: UsersSolid },
  { name: 'Scan QR', href: '/scan', icon: QrCodeIcon, iconSolid: QrSolid },
  { name: 'History', href: '/scans', icon: ClockIcon, iconSolid: ClockSolid },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <aside className="flex flex-col w-[220px] bg-white border-r border-[#e2e8f0] h-full shrink-0">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-[#f1f5f9]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
            }}
          >
            <QrCodeIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f172a] leading-none">QR Access</p>
            <p className="text-[10px] text-[#94a3b8] mt-0.5 leading-none">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-[#cbd5e1] uppercase tracking-widest px-2 mb-2">
          Menu
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = isActive ? item.iconSolid : item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-100
                ${isActive
                  ? 'bg-[#eef2ff] text-[#4f46e5]'
                  : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#334155]'
                }
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#6366f1]' : 'text-[#94a3b8]'}`} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — user */}
      <div className="px-3 py-4 border-t border-[#f1f5f9]">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[#f8fafc] transition-colors group">
          {/* Avatar */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#334155] truncate">{user?.username}</p>
            <p className="text-[10px] text-[#94a3b8] capitalize truncate">
              {user?.role?.replace(/_/g, ' ')}
            </p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#94a3b8] hover:text-[#ef4444]"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
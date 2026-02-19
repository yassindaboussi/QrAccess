'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useScans } from '@/lib/hooks/useScans';
import { ScanLog } from '@/lib/types';
import { formatDateTime } from '@/lib/utils/format';
import { FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ScanHistoryProps {
  userId?: string;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [status, setStatus] = useState<string>('all');

  const { scans, pagination, isLoading } = useScans({
    page, userId,
    from: dateRange.from,
    to: dateRange.to,
    result: status === 'all' ? undefined : status,
  });

  const columns = [
    {
      key: 'user',
      title: 'Member',
      render: (scan: ScanLog) => {
        if (scan.reason === 'not_found' || scan.reason === 'invalid_code') {
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-[#94a3b8]">?</span>
              </div>
              <span className="text-sm text-[#94a3b8]">Unknown</span>
            </div>
          );
        }
        const name = scan.userId && typeof scan.userId === 'object' ? scan.userId.fullName : null;
        const initials = name ? name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() : 'DU';
        return (
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
              style={{ background: name ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0' }}
            >
              {initials}
            </div>
            <span className={`text-sm font-medium ${name ? 'text-[#334155]' : 'text-[#94a3b8] italic'}`}>
              {name || 'Deleted user'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'scanner',
      title: 'Scanner',
      render: (scan: ScanLog) => (
        <span className="text-sm text-[#64748b]">{scan.scannerId?.username || '—'}</span>
      ),
    },
    {
      key: 'result',
      title: 'Result',
      render: (scan: ScanLog) => (
        <Badge variant={scan.result === 'granted' ? 'success' : 'danger'}>
          {scan.result.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'reason',
      title: 'Reason',
      render: (scan: ScanLog) => (
        <span className="text-xs text-[#94a3b8] capitalize bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-md">
          {scan.reason?.replace(/_/g, ' ') || 'N/A'}
        </span>
      ),
    },
    {
      key: 'scannedAt',
      title: 'Time',
      render: (scan: ScanLog) => (
        <span className="text-xs font-mono text-[#94a3b8]">{formatDateTime(scan.scannedAt)}</span>
      ),
    },
  ];

  const selectClass = "px-3 py-2 text-sm border border-[#e2e8f0] rounded-xl bg-white text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all cursor-pointer";

  return (
    <Card
      title="Scan History"
      subtitle="Every access attempt is logged here"
      action={
        <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
          <FunnelIcon className="w-3.5 h-3.5" />
          <span>Filter</span>
        </div>
      }
      noPadding
    >
      {/* Filters */}
      <div className="px-6 py-4 border-b border-[#f1f5f9] flex flex-wrap gap-2.5 items-center bg-[#fafbfc]">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={selectClass}>
          <option value="all">All results</option>
          <option value="granted">Granted</option>
          <option value="denied">Denied</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.from || ''}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className={selectClass}
          />
          <span className="text-xs text-[#cbd5e1]">→</span>
          <input
            type="date"
            value={dateRange.to || ''}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className={selectClass}
          />
        </div>

        {(dateRange.from || dateRange.to || status !== 'all') && (
          <button
            onClick={() => { setDateRange({}); setStatus('all'); setPage(1); }}
            className="text-xs text-[#6366f1] hover:text-[#4f46e5] font-medium transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="px-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#e2e8f0] border-t-[#6366f1] rounded-full animate-spin" />
          </div>
        ) : (
          <Table columns={columns} data={scans} />
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-[#f1f5f9] flex items-center justify-between bg-[#fafbfc]">
          <p className="text-xs text-[#94a3b8]">
            Page <span className="font-semibold text-[#334155]">{page}</span> of{' '}
            <span className="font-semibold text-[#334155]">{pagination.pages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="w-3.5 h-3.5" />
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
            >
              Next
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
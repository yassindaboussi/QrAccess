'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ScanHistory } from '@/components/features/scans/ScanHistory';

export default function ScansPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Scan History</h1>
      </div>

      <ScanHistory />
    </div>
  );
}
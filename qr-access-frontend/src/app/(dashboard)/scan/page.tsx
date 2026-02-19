'use client';

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useVerifyQR } from '@/lib/hooks/useScans';
import { useAuth } from '@/lib/hooks/useAuth';
import { QrCodeIcon, ArrowUpTrayIcon, CheckCircleIcon, XCircleIcon, ShieldExclamationIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ScanResult } from '@/lib/types';
import toast from 'react-hot-toast';
import QrScanner from 'qr-scanner';

export default function ScanPage() {
  const [qrData, setQrData] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const verifyQR = useVerifyQR();

  if (!user || user.role !== 'super_admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#fef2f2] flex items-center justify-center mb-4">
          <ShieldExclamationIcon className="w-8 h-8 text-[#ef4444]" />
        </div>
        <h2 className="text-lg font-semibold text-[#0f172a] mb-1">Access Restricted</h2>
        <p className="text-sm text-[#94a3b8]">You don't have permission to scan QR codes.</p>
      </div>
    );
  }

  const handleScan = async (qrDataToVerify?: string) => {
    const dataToVerify = qrDataToVerify || qrData;
    if (!dataToVerify.trim()) {
      toast.error('Please enter a QR code');
      return;
    }
    try {
      const result = await verifyQR.mutateAsync({ qrData: dataToVerify });
      if (result.data) setScanResult(result.data);
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.error?.details) {
        const sr = error.response.data.error.details;
        setScanResult(sr);
        const msgs: Record<string, string> = {
          active: 'Access Granted', not_started: 'Subscription not started', expired: 'Subscription expired', no_subscription: 'No active subscription',
        };
        sr.reason === 'active' ? toast.success(msgs[sr.reason]) : toast.error(msgs[sr.reason] || 'Access Denied');
      } else if (error.response?.status === 400) {
        toast.error('Invalid QR code format');
      } else if (error.response?.status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Scan failed. Please try again.');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading('Reading QR code…', { id: 'qr-scan' });
      const result = await QrScanner.scanImage(file);
      if (result) {
        setQrData(result);
        toast.success('QR code detected!', { id: 'qr-scan' });
        await handleScan(result);
      }
    } catch {
      toast.error('No QR code found in image', { id: 'qr-scan' });
    }
  };

  const granted = scanResult?.status === 'granted';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">QR Code Scanner</h1>
        <p className="text-sm text-[#94a3b8] mt-1">Verify member access by scanning or uploading a QR code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: Scanner Input ── */}
        <Card title="Verify Code" subtitle="Enter manually or upload an image">
          <div className="space-y-5">
            {/* Text input */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">QR Code Data</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                  <input
                    type="text"
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                    placeholder="Paste code or scan…"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl text-[#0f172a] placeholder:text-[#cbd5e1] bg-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1] shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all"
                  />
                </div>
                <Button onClick={() => handleScan()} loading={verifyQR.isPending} size="md">
                  Verify
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#f1f5f9]" />
              <span className="text-xs font-medium text-[#cbd5e1]">or</span>
              <div className="flex-1 h-px bg-[#f1f5f9]" />
            </div>

            {/* Upload zone */}
            <div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="
                  w-full flex flex-col items-center gap-3 py-10 px-6
                  border-2 border-dashed border-[#e2e8f0] rounded-xl
                  hover:border-[#6366f1] hover:bg-[#fafbff]
                  transition-all duration-150 group text-center
                "
              >
                <div className="w-10 h-10 rounded-xl bg-[#eef2ff] group-hover:bg-[#e0e7ff] transition-colors flex items-center justify-center">
                  <ArrowUpTrayIcon className="w-5 h-5 text-[#6366f1]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#334155] group-hover:text-[#4f46e5] transition-colors">
                    Upload QR Code image
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">PNG, JPG, WEBP — auto-detected</p>
                </div>
              </button>
            </div>

            {scanResult && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => { setScanResult(null); setQrData(''); }}
              >
                Clear & Scan Again
              </Button>
            )}
          </div>
        </Card>

        {/* ── Right: Result ── */}
        <Card title="Scan Result" subtitle={scanResult ? 'Verification complete' : 'Awaiting scan'}>
          {scanResult ? (
            <div className="space-y-5">
              {/* Status banner */}
              <div
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  granted
                    ? 'bg-[#ecfdf5] border-[#a7f3d0]'
                    : 'bg-[#fef2f2] border-[#fecaca]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${granted ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
                  {granted
                    ? <CheckCircleIcon className="w-6 h-6 text-white" />
                    : <XCircleIcon className="w-6 h-6 text-white" />
                  }
                </div>
                <div>
                  <p className={`text-sm font-bold ${granted ? 'text-[#065f46]' : 'text-[#991b1b]'}`}>
                    {scanResult.message}
                  </p>
                  {scanResult.reason && (
                    <p className="text-xs text-[#94a3b8] mt-0.5 capitalize">
                      Reason: {scanResult.reason.replace(/_/g, ' ')}
                    </p>
                  )}
                </div>
                <div className="ml-auto">
                  <Badge variant={granted ? 'success' : 'danger'}>
                    {granted ? 'GRANTED' : 'DENIED'}
                  </Badge>
                </div>
              </div>

              {/* Member details */}
              {scanResult.user && (
                <div>
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
                    Member Details
                  </p>
                  <div className="rounded-xl border border-[#f1f5f9] overflow-hidden">
                    {[
                      ['Full Name', scanResult.user.fullName],
                      ['Email', scanResult.user.email],
                      ['Phone', scanResult.user.phoneNumber],
                      ['Unique Code', scanResult.user.uniqueCode],
                      ['Subscription', scanResult.user.subscriptionType],
                      ['Start Date', scanResult.user.subscriptionStart && new Date(scanResult.user.subscriptionStart).toLocaleDateString()],
                      ['End Date', scanResult.user.subscriptionEnd && new Date(scanResult.user.subscriptionEnd).toLocaleDateString()],
                      ['Notes', scanResult.user.subscriptionNotes],
                      ['Member Since', new Date(scanResult.user.createdAt).toLocaleDateString()],
                    ].filter(([_, v]) => v).map(([label, value], i, arr) => (
                      <div
                        key={label as string}
                        className={`flex justify-between items-center px-4 py-2.5 ${i < arr.length - 1 ? 'border-b border-[#f8fafc]' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'}`}
                      >
                        <span className="text-xs text-[#94a3b8] font-medium">{label}</span>
                        <span className={`text-xs font-medium text-[#334155] text-right max-w-[55%] truncate ${label === 'Unique Code' ? 'font-mono' : ''}`}>
                          {value as string}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[#f8fafc] border-2 border-dashed border-[#e2e8f0] flex items-center justify-center mb-5">
                <QrCodeIcon className="w-9 h-9 text-[#cbd5e1]" />
              </div>
              <p className="text-sm font-medium text-[#334155] mb-1">No scan yet</p>
              <p className="text-xs text-[#94a3b8]">Verify a QR code to see member details here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
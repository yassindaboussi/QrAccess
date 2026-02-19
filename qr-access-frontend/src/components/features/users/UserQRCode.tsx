'use client';

import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/Button';

interface UserQRCodeProps {
  user: {
    _id: string;
    uniqueCode: string;
    fullName: string;
  };
}

export const UserQRCode: React.FC<UserQRCodeProps> = ({ user }) => {
  const handleDownload = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${user.fullName.replace(/\s+/g, '-')}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
      const imageUrl = canvas.toDataURL('image/png');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${user.fullName}</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .container {
                text-align: center;
                padding: 20px;
              }
              img {
                max-width: 300px;
                height: auto;
              }
              .name {
                margin-top: 10px;
                font-size: 18px;
                font-weight: bold;
              }
              .code {
                color: #666;
                font-size: 14px;
                margin-top: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="${imageUrl}" alt="QR Code" />
              <div class="name">${user.fullName}</div>
              <div class="code">${user.uniqueCode}</div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <QRCodeCanvas
          id="qr-code"
          value={user.uniqueCode}
          size={200}
          level="H"
          includeMargin
        />
      </div>
      
      <p className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
        {user.uniqueCode}
      </p>

      <div className="flex space-x-2">
        <Button size="sm" onClick={handleDownload}>
          Download
        </Button>
        <Button size="sm" variant="secondary" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </div>
  );
};
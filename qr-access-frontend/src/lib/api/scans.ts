import { apiClient } from './client';
import { ApiResponse, ScanLog, ScanResult } from '../types';

export const scansApi = {
  verifyQR: async (qrData: string) => {
    const response = await apiClient.post<ApiResponse<ScanResult>>('/scan', {
      qrData,
    });
    return response.data;
  },

  getScanHistory: async (params?: {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    userId?: string;
    result?: string;
  }) => {
    const response = await apiClient.get('/scan/history', { params });
    return response.data;
  },

  getDailyStats: async (date?: Date) => {
    const response = await apiClient.get('/scan/stats/daily', {
      params: date ? { date: date.toISOString() } : {},
    });
    return response.data;
  },

  getHourlyStats: async (date?: Date) => {
    const response = await apiClient.get('/scan/stats/hourly', {
      params: date ? { date: date.toISOString() } : {},
    });
    return response.data;
  },
};
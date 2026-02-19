import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scansApi } from '../api/scans';
import { ScanLog } from '../types';
import toast from 'react-hot-toast';

interface DailyStats {
  total: number;
  granted: number;
  denied: number;
}

interface HourlyStat {
  _id: number;
  stats: number;
}

export const useScans = (params?: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  userId?: string;
  result?: string;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['scans', params],
    queryFn: () => scansApi.getScanHistory(params),
  });

  return {
    scans: (data?.data?.scans as ScanLog[]) || [],
    pagination: data?.data?.pagination,
    isLoading,
    error,
    refetch,
  };
};

export const useVerifyQR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ qrData }: { qrData: string }) =>
      scansApi.verifyQR(qrData),
    onSuccess: (data) => {
      // Invalidate scan history cache to show new scan immediately
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      
      if (data.data.status === 'granted') {
        toast.success('Access Granted!', { duration: 3000 });
      } else {
        toast.error(`Access Denied: ${data.data.reason}`, { duration: 3000 });
      }
    },
    onError: (error: any) => {
      // Check if it's a 403 error (access denied) - if so, invalidate cache
      if (error.response?.status === 403) {
        queryClient.invalidateQueries({ queryKey: ['scans'] });
        toast.error(error.response?.data?.error?.message || 'Access Denied');
      } else {
        toast.error(error.response?.data?.error?.message || 'Scan failed');
      }
    },
  });
};
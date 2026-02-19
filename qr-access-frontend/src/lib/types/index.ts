 // User Types
export interface User {
  _id: string;
  uniqueCode: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  subscriptionType?: 'day' | 'week' | 'month' | 'year' | 'custom' | null;
  subscriptionStart?: string | null;
  subscriptionEnd?: string | null;
  subscriptionNotes?: string;
  createdAt: string;
  updatedAt: string;
  hasActiveSubscription?: boolean;
  subscriptionStatus?: 'active' | 'expired' | 'future' | 'none';
}

export interface CreateUserData {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  subscription?: {
    duration: 'day' | 'week' | 'month' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
    notes?: string;
  };
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  subscriptionType?: 'day' | 'week' | 'month' | 'year' | 'custom' | null;
  subscriptionStart?: string | null;
  subscriptionEnd?: string | null;
  subscriptionNotes?: string;
}

// Scan Types
export interface ScanLog {
  _id: string;
  userId: User | string;
  uniqueCode: string;
  scannerId: {
    _id: string;
    username: string;
  };
  result: 'granted' | 'denied';
  reason: string;
  scannedAt: string;
}

export interface ScanResult {
  status: 'granted' | 'denied';
  message: string;
  user?: User;
  reason?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    admin: Admin;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'super_admin';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  users?: T[];
  scans?: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
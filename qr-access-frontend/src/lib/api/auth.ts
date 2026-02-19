 
import { apiClient } from './client';
import { AuthResponse, LoginCredentials } from '../types';
import Cookies from 'js-cookie';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Store tokens in cookies
    if (response.data.success) {
      const { accessToken, refreshToken } = response.data.data.tokens;
      Cookies.set('accessToken', accessToken, { expires: 7 });
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
    }
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    }
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get('accessToken');
  },
};
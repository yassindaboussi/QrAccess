import { apiClient } from './client';
import { ApiResponse, User, CreateUserData, UpdateUserData, PaginatedResponse } from '../types';

export const usersApi = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>('/users', {
      params,
    });
    return response.data;
  },

  // ... rest of the methods remain the same
  getUser: async (id: string) => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserData) => {
    const response = await apiClient.post<ApiResponse<{
      user: User;
      subscription: any;
      qrCode: { image: string; value: string };
    }>>('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/users/${id}`);
    return response.data;
  },

  getExpiringUsers: async (days: number = 7) => {
    const response = await apiClient.get('/users/expiring', { params: { days } });
    return response.data;
  },

  createSubscription: async (userId: string, data: any) => {
    const response = await apiClient.post(`/users/${userId}/subscriptions`, data);
    return response.data;
  },
};
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth';
import { Admin } from '../types';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (authApi.isAuthenticated()) {
        const response = await authApi.getProfile();
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    setUser(response.data.admin);
    return response;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    router.push('/login');
  };

  const hasRole = (role: string) => {
    return user?.role === 'super_admin';
  };

  const isAuthenticated = () => {
    return !!user && authApi.isAuthenticated();
  };

  return {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
  };
};
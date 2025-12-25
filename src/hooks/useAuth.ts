import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/client';
import { authService } from '@/services/authService';

const AUTH_KEY = 'creditscore_auth';
const TOKEN_KEY = 'creditscore_token';

// Set to true to use real API, false for localStorage demo mode
const USE_API = import.meta.env.VITE_USE_API === 'true';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_KEY);

      if (USE_API && storedToken) {
        authService.setToken(storedToken);
        const response = await authService.getCurrentUser();
        if (response.data) {
          setUser(response.data);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(AUTH_KEY);
        }
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (USE_API) {
      const response = await authService.login({ email, password });
      if (response.data) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(AUTH_KEY, JSON.stringify(response.data.user));
        setUser(response.data.user);
        return true;
      }
      return false;
    }

    // Demo mode - simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email && password.length >= 4) {
      const user: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      setUser(user);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    if (USE_API) {
      const response = await authService.signup({ name, email, password });
      return !response.error;
    }

    // Demo mode - simulate signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }, []);

  const logout = useCallback(async () => {
    if (USE_API) {
      await authService.logout();
    }
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (user) {
      if (USE_API) {
        const response = await authService.updateProfile(updates);
        if (response.data) {
          localStorage.setItem(AUTH_KEY, JSON.stringify(response.data));
          setUser(response.data);
          return;
        }
      }
      
      // Demo mode
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  return { user, isLoading, login, signup, logout, updateUser, isAuthenticated: !!user };
}

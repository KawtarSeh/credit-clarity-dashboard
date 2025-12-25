import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/client';
import { authService } from '@/services/authService';

const AUTH_KEY = 'creditscore_auth';
const TOKEN_KEY = 'creditscore_token';

const USE_API = import.meta.env.VITE_USE_API === 'true';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Restore session
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (USE_API && token) {
        authService.setToken(token);
        const response = await authService.getCurrentUser();

        if (response.data) {
          setUser(response.data);
          localStorage.setItem(AUTH_KEY, JSON.stringify(response.data));
        } else {
          localStorage.clear();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 🔹 LOGIN
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!USE_API) return false;

    const response = await authService.login({ email, password });

    if (response.data) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(AUTH_KEY, JSON.stringify(response.data.user));
      setUser(response.data.user);
      return true;
    }

    return false;
  }, []);

  // 🔹 SIGNUP + AUTO LOGIN
  const signup = useCallback(async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    if (!USE_API) return false;

    const response = await authService.signup({ name, email, password });
    if (response.error) return false;

    // Auto login after signup
    return await login(email, password);
  }, [login]);

  // 🔹 LOGOUT
  const logout = useCallback(async () => {
    if (USE_API) {
      await authService.logout();
    }
    localStorage.clear();
    setUser(null);
  }, []);

  // 🔹 UPDATE PROFILE
  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user || !USE_API) return;

    const response = await authService.updateProfile(updates);
    if (response.data) {
      setUser(response.data);
      localStorage.setItem(AUTH_KEY, JSON.stringify(response.data));
    }
  }, [user]);

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };
}

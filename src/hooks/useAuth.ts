import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/client';

const AUTH_KEY = 'creditscore_auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo credentials check
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

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  return { user, isLoading, login, logout, updateUser, isAuthenticated: !!user };
}

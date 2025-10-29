import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, removeToken, saveToken, authAPI } from '../services/api';
import { router } from 'expo-router';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const loadUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const checkAuth = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) {
        setIsAuthenticated(true);
        await loadUserProfile();
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (token: string) => {
    await saveToken(token);
    setIsAuthenticated(true);
    await loadUserProfile();
  };

  const signOut = async () => {
    await removeToken();
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/(auth)/sign-in');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signOut,
        checkAuth,
        loadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


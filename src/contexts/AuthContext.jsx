/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = 'moodspace_auth_user';

const AuthContext = createContext(null);

const readStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (error) {
    console.error('Failed to load auth state', error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event) => {
      if (event.key === AUTH_STORAGE_KEY) {
        setUser(readStoredUser());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = ({ email, name }) => {
    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail) throw new Error('Email is required');

    const displayName = name?.trim() || trimmedEmail.split('@')[0] || 'Guest';
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `guest-${Date.now()}`;

    const authUser = {
      id,
      email: trimmedEmail,
      name: displayName,
      createdAt: new Date().toISOString(),
    };

    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

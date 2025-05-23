'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ZkLoginSession, getCurrentSession, clearSession, isLoggedIn } from '@/utils/zkLogin';

interface ZkLoginContextType {
  session: ZkLoginSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  refreshSession: () => void;
}

const ZkLoginContext = createContext<ZkLoginContextType | undefined>(undefined);

export function ZkLoginProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ZkLoginSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = () => {
    const currentSession = getCurrentSession();
    setSession(currentSession);
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  useEffect(() => {
    // Check for existing session on mount
    refreshSession();
    setLoading(false);
  }, []);

  const value: ZkLoginContextType = {
    session,
    isAuthenticated: isLoggedIn(),
    loading,
    logout,
    refreshSession,
  };

  return (
    <ZkLoginContext.Provider value={value}>
      {children}
    </ZkLoginContext.Provider>
  );
}

export function useZkLogin() {
  const context = useContext(ZkLoginContext);
  if (context === undefined) {
    throw new Error('useZkLogin must be used within a ZkLoginProvider');
  }
  return context;
} 
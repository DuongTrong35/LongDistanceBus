import React, { createContext, useContext, useState } from 'react';

type AuthResp = { accessToken: string; fullName: string };
type AuthState = {
  token: string | null;
  fullName: string | null;
  setAuth: (a: AuthResp | null) => void;
};

const Ctx = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const safeGet = (k: string) => {
    try { return localStorage.getItem(k); } catch { return null; }
  };

  const [token, setToken] = useState<string | null>(() => safeGet('token'));
  const [fullName, setFullName] = useState<string | null>(() => safeGet('fullName'));

  const setAuth = (a: AuthResp | null) => {
    try {
      if (a) {
        setToken(a.accessToken);
        setFullName(a.fullName);
        localStorage.setItem('token', a.accessToken);
        localStorage.setItem('fullName', a.fullName);
      } else {
        setToken(null);
        setFullName(null);
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
      }
    } catch {
      // ignore storage errors in dev
    }
  };

  return (
    <Ctx.Provider value={{ token, fullName, setAuth }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
};

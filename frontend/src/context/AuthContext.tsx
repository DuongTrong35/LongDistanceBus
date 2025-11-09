import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, setToken as saveToken, clearToken, getToken } from "../lib/api";

type AuthState = { fullName: string | null };
type AuthCtx = {
  fullName: string | null;
  isAuthed: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [fullName, setFullName] = useState<string | null>(null);

  // Khôi phục phiên khi F5 (tên lưu ở localStorage)
  useEffect(() => {
    const stored = localStorage.getItem("fullName");
    if (stored && getToken()) setFullName(stored);
  }, []);

  async function login(emailOrPhone: string, password: string) {
    const res = await loginApi({ emailOrPhone, password });
    saveToken(res.accessToken);                 // lưu JWT
    localStorage.setItem("fullName", res.fullName);
    setFullName(res.fullName);
  }

  function logout() {
    clearToken();
    localStorage.removeItem("fullName");
    setFullName(null);
  }

  return (
    <Ctx.Provider value={{ fullName, isAuthed: !!fullName, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}

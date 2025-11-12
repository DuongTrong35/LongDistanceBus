import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, clearToken, getToken, fetchProfile } from "../lib/api";

type AuthCtx = {
  fullName: string | null;
  isAuthed: boolean;
  login: (emailOrPhone: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    async function hydrate() {
      if (!getToken()) return;
      try {
        const profile = await fetchProfile();
        const name = profile.fullName ?? profile.email ?? null;
        setFullName(name);
        if (name) localStorage.setItem("fullName", name);
      } catch (err) {
        clearToken();
        localStorage.removeItem("fullName");
      }
    }
    hydrate();
  }, []);

  async function login(email: string, password: string) {
    await loginApi({ email, password });
    try {
      const profile = await fetchProfile();
      const name = profile.fullName ?? profile.email ?? null;
      if (name) localStorage.setItem("fullName", name);
      setFullName(name);
    } catch (err) {
      setFullName(null);
      throw err;
    }
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

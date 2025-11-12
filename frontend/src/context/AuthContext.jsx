import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi, clearToken, getToken, fetchProfile } from "../lib/api";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [fullName, setFullName] = useState(null);

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

  async function login(email, password) {
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

  async function register(payload) {
    await registerApi(payload);
    // After registration, optionally auto-login
    try {
      const profile = await fetchProfile();
      const name = profile.fullName ?? profile.email ?? null;
      if (name) localStorage.setItem("fullName", name);
      setFullName(name);
    } catch (err) {
      // Registration succeeded but profile fetch failed - that's okay
    }
  }

  function logout() {
    clearToken();
    localStorage.removeItem("fullName");
    setFullName(null);
  }

  return (
    <Ctx.Provider value={{ fullName, isAuthed: !!fullName, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}


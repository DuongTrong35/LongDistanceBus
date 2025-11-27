import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi, clearToken, getToken, fetchProfile } from "../lib/api";

const Ctx = createContext(null);

const USER_STORAGE_KEY = "ldbus:user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    async function hydrate() {
      if (!getToken()) return;
      try {
        const profile = await fetchProfile();
        const hydrated = {
          id: profile.userId ?? profile.id ?? null,
          fullName: profile.fullName ?? profile.email ?? null,
          phone: profile.phone ?? null,
        };
        setUser(hydrated);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(hydrated));
      } catch (err) {
        clearToken();
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      }
    }
    hydrate();
  }, []);

  async function login(phone, password) {
    const res = await loginApi({ phone, password });
    const loggedInUser = {
      id: res.userId ?? null,
      fullName: res.fullName ?? null,
      phone: res.phone ?? phone ?? null,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }

  async function register(payload) {
    await registerApi(payload);
  }

  function logout() {
    clearToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }

  return (
    <Ctx.Provider
      value={{
        user,
        userId: user?.id ?? null,
        fullName: user?.fullName ?? null,
        isAuthed: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}


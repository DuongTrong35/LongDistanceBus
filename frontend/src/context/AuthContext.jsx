import { createContext, useContext, useEffect, useState } from "react";
import {
  loginApi,
  registerApi,
  clearToken,
  getToken,
  fetchProfile,
} from "../lib/api";

const Ctx = createContext(null);

const USER_STORAGE_KEY = "ldbus:user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  });

  // Hydrate từ token khi load app
  useEffect(() => {
    async function hydrate() {
      if (!getToken()) return;
      try {
        const profile = await fetchProfile();
        const hydrated = {
          id: profile.userId ?? profile.id ?? null,
          fullName: profile.fullName ?? profile.email ?? null,
          phone: profile.phone ?? null,
          email: profile.email ?? null,
          dateOfBirth: profile.dateOfBirth ?? null,
          gender: profile.gender ?? null,
          avatar: profile.avatar ?? null,
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

  // LOGIN: sau khi có token, gọi /me để lấy full profile
  async function login(phone, password) {
    const res = await loginApi({ phone, password }); // loginApi tự set token

    // Lấy profile đầy đủ từ backend
    const profile = await fetchProfile();

    const loggedInUser = {
      id: profile.userId ?? profile.id ?? res.userId ?? null,
      fullName: profile.fullName ?? res.fullName ?? null,
      phone: profile.phone ?? res.phone ?? phone ?? null,
      email: profile.email ?? null,
      dateOfBirth: profile.dateOfBirth ?? null,
      gender: profile.gender ?? null,
      avatar: profile.avatar ?? null,
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

  // cho Person.jsx cập nhật lại context (tên, ngày sinh, giới tính, email, avatar…)
  function updateUser(partial) {
    setUser((prev) => {
      const next = { ...(prev || {}), ...partial };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <Ctx.Provider
      value={{
        user,
        userId: user?.id ?? null,
        fullName: user?.fullName ?? null,
        phone: user?.phone ?? null,
        email: user?.email ?? null,
        isAuthed: !!user,
        login,
        register,
        logout,
        updateUser,
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

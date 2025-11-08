import { http } from "./http";

export type LoginPayload = { email: string; password: string };

export async function login(payload: LoginPayload) {
  // FE gọi qua Gateway: http://localhost:8080/api/auth/login
  const res = await http.post("/api/auth/login", payload);
  return res.data; // { accessToken, expiresIn, ... }
}

export async function register(payload: {
  fullName: string;
  email: string;
  password: string;
}) {
  const res = await http.post("/api/auth/register", payload);
  return res.data;
}

export async function forgotPassword(email: string) {
  const res = await http.post("/api/auth/forgot-password", { email });
  return res.data;
}

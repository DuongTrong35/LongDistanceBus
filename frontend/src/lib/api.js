// client/frontend/src/lib/api.js
import { http } from "./http";

/** ===== Token helpers ===== */
export function setToken(token) {
  localStorage.setItem("accessToken", token);
}
export function getToken() {
  return localStorage.getItem("accessToken");
}
export function clearToken() {
  localStorage.removeItem("accessToken");
}

// attach Authorization header automatically
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** ===== Auth APIs ===== */
export async function loginApi(payload) {
  const res = await http.post("/api/auth/login", payload);
  if (res?.data?.accessToken) setToken(res.data.accessToken);
  return res.data; // { accessToken, tokenType, ... }
}

export async function fetchProfile() {
  const res = await http.get("/api/auth/me");
  return res.data;
}

export async function registerApi(payload) {
  const res = await http.post("/api/auth/register", payload);
  return res.data;
}

/** ===== Booking/Search/Home APIs ===== */
export async function getStations() {
  // Nếu backend đã có endpoint:
  const res = await http.get("/api/booking/stations");
  return res.data;

  // Nếu chưa có endpoint, tạm mock (chỉ bật khi cần):
  // return [
  //   { id: 1, name: "Sài Gòn" },
  //   { id: 2, name: "Nha Trang" },
  //   { id: 3, name: "Đà Lạt" },
  // ];
}

export async function searchTrips(params) {
  const res = await http.get("/api/booking/search", { params });
  return res.data;
}

export async function getTripDetail(tripId) {
  const res = await http.get(`/api/booking/trips/${tripId}/seats`);
  return res.data;
}


// ---- Base URL (đặt trong client/frontend/.env: VITE_API_BASE=http://localhost:8080)
const BASE: string = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// ---- Token helpers
export function getToken(): string | null {
  return localStorage.getItem("accessToken");
}
export function setToken(tok: string) {
  localStorage.setItem("accessToken", tok);
}
export function clearToken() {
  localStorage.removeItem("accessToken");
}

// ---- Common fetch helpers (tự gắn Bearer nếu needAuth = true)
async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T = any>(path: string, needAuth = false): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (needAuth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, { headers });
  return handleJson<T>(res);
}

export async function apiPost<T = any>(
  path: string,
  body: any,
  needAuth = false
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (needAuth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return handleJson<T>(res);
}

// ---- Auth APIs (NAMED EXPORTS)
export type LoginReq = { emailOrPhone: string; password: string };
export type AuthResp = { accessToken: string; fullName: string };

export async function loginApi(payload: LoginReq): Promise<AuthResp> {
  const res = await fetch(`${BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson<AuthResp>(res);
}

// ---- Business APIs (NAMED EXPORTS)
export type Station = { id: number; name: string };
export async function getStations(): Promise<Station[]> {
  // nếu endpoint yêu cầu JWT thì để true
  return apiGet<Station[]>("/api/stations", true);
}

export type SearchTripsParams = { fromId: number; toId: number; date: string };
export async function searchTrips(params: SearchTripsParams) {
  const q = new URLSearchParams({
    fromId: String(params.fromId),
    toId: String(params.toId),
    date: params.date, // YYYY-MM-DD
  });
  return apiGet(`/api/trips/search?${q.toString()}`, true);
}

export type TripDetail = {
  id: number;
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  busName: string;
  busPlate: string;
  seats: Array<{ id: number; code: string; type: string; booked: boolean }>;
};
export async function getTripDetail(id: number): Promise<TripDetail> {
  return apiGet<TripDetail>(`/api/trips/${id}`, true);
}

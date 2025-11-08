export type LoginReq = { emailOrPhone: string; password: string };
export type AuthResp = { accessToken: string; fullName: string };

export async function loginApi(payload: LoginReq): Promise<AuthResp> {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    // đọc message server (nếu có)
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `Login failed (${res.status})`);
  }
  return res.json();
}

// --- NEW: lấy danh sách bến, tìm theo tên ---
export async function getStations(): Promise<{id:number; name:string}[]> {
  return apiGet("/api/stations");
}

// --- NEW: tìm chuyến ---
export async function searchTrips(params: { fromId: number; toId: number; date: string }) {
  const q = new URLSearchParams({
    fromId: String(params.fromId),
    toId: String(params.toId),
    date: params.date,                       // YYYY-MM-DD
  });
  return apiGet(`/api/trips/search?${q.toString()}`);
}
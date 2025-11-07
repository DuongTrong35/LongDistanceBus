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

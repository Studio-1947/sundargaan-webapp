import { getAdminToken } from '../lib/adminAuth';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? '/api/v1';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-admin-token': token } : {}),
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

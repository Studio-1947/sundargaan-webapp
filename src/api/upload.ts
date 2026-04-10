import { getAdminToken } from '../lib/adminAuth';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? '/api/v1';

export type UploadType = 'image' | 'audio' | 'video' | 'document';
export type Provider = 'vercel' | 'cloudinary';

export interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  provider: Provider;
  publicId?: string;
}

export async function uploadFile(
  file: File,
  type: UploadType,
  provider: Provider,
  folder?: string,
): Promise<{ url: string; pathname: string; size: number; provider: Provider }> {
  const form = new FormData();
  form.append('file', file);
  form.append('provider', provider);
  if (folder) form.append('folder', folder);
  const token = getAdminToken();

  const res = await fetch(`${BASE_URL}/upload/${type}?provider=${provider}`, {
    method: 'POST',
    headers: token ? { 'x-admin-token': token } : undefined,
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Upload failed (${res.status})`);
  }
  return res.json();
}

export async function listBlobs(
  provider: Provider,
  type: UploadType,
  prefix?: string,
): Promise<BlobItem[]> {
  const params = new URLSearchParams({ provider, type });
  if (prefix) params.set('prefix', prefix);
  const token = getAdminToken();

  const res = await fetch(`${BASE_URL}/upload/list?${params}`, {
    headers: token ? { 'x-admin-token': token } : undefined,
  });
  if (!res.ok) throw new Error(`Failed to list blobs (${res.status})`);
  const data = await res.json();
  return data.blobs as BlobItem[];
}

export async function deleteBlob(url: string, provider: Provider): Promise<void> {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-admin-token': token } : {}),
    },
    body: JSON.stringify({ url, provider }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Delete failed (${res.status})`);
  }
}

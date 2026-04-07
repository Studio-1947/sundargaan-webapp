const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? '/api/v1';

export type UploadType = 'image' | 'audio' | 'video' | 'document';

export interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

export async function uploadFile(
  file: File,
  type: UploadType,
  folder?: string,
): Promise<{ url: string; pathname: string; size: number }> {
  const form = new FormData();
  form.append('file', file);
  if (folder) form.append('folder', folder);

  const res = await fetch(`${BASE_URL}/upload/${type}`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Upload failed (${res.status})`);
  }
  return res.json();
}

export async function listBlobs(prefix?: string): Promise<BlobItem[]> {
  const url = prefix
    ? `${BASE_URL}/upload/list?prefix=${encodeURIComponent(prefix)}`
    : `${BASE_URL}/upload/list`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to list blobs (${res.status})`);
  const data = await res.json();
  return data.blobs as BlobItem[];
}

export async function deleteBlob(blobUrl: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: blobUrl }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Delete failed (${res.status})`);
  }
}

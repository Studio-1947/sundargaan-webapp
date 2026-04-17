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
  if (provider === 'cloudinary') {
    // 1. Get signature from backend
    const folderPath = folder ?? `sundargaan/${type}s`;
    const params = new URLSearchParams({
      folder: folderPath,
      // For audio/video, they are 'video' type in Cloudinary
      // but for generating signature we use the same params as in upload
    });
    
    const sigRes = await fetch(`${BASE_URL}/upload/signature?${params}`);
    if (!sigRes.ok) throw new Error('Failed to get upload signature');
    const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

    // 2. Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folderPath);

    const resourceType = type === 'audio' || type === 'video' ? 'video' : type === 'image' ? 'image' : 'auto';
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const res = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message ?? `Cloudinary upload failed (${res.status})`);
    }

    const data = await res.json();
    return {
      url: data.secure_url,
      pathname: data.public_id,
      size: data.bytes,
      provider: 'cloudinary',
    };
  }

  // Vercel Blob (Fallback or specific choice)
  const form = new FormData();
  form.append('file', file);
  form.append('provider', provider);
  if (folder) form.append('folder', folder);

  const res = await fetch(`${BASE_URL}/upload/${type}?provider=${provider}`, {
    method: 'POST',
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

  const res = await fetch(`${BASE_URL}/upload/list?${params}`);
  if (!res.ok) throw new Error(`Failed to list blobs (${res.status})`);
  const data = await res.json();
  return data.blobs as BlobItem[];
}

export async function deleteBlob(url: string, provider: Provider): Promise<void> {
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, provider }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `Delete failed (${res.status})`);
  }
}

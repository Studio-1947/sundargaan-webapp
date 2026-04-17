import { Injectable, BadRequestException } from '@nestjs/common';
import { put, del, list } from '@vercel/blob';
import { CloudinaryService, UploadType } from './cloudinary.service';

export type Provider = 'vercel' | 'cloudinary';

const ALLOWED_MIME: Record<UploadType, string[]> = {
  image:    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  audio:    ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'],
  video:    ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  document: ['application/pdf', 'text/plain'],
};

const MAX_SIZE: Record<UploadType, number> = {
  image:    10 * 1024 * 1024,
  audio:    50 * 1024 * 1024,
  video:    200 * 1024 * 1024,
  document: 20 * 1024 * 1024,
};

export interface BlobResult {
  url: string;
  pathname: string;
  size: number;
  provider: Provider;
  publicId?: string;
}

export interface BlobListItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  provider: Provider;
  publicId?: string;
}

@Injectable()
export class UploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async upload(
    file: Express.Multer.File,
    type: UploadType,
    provider: string = 'cloudinary',
    folder?: string,
  ): Promise<BlobResult> {
    if (!ALLOWED_MIME[type].includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type "${file.mimetype}" for upload type "${type}". Allowed: ${ALLOWED_MIME[type].join(', ')}`,
      );
    }
    if (file.size > MAX_SIZE[type]) {
      const mb = MAX_SIZE[type] / (1024 * 1024);
      throw new BadRequestException(`File too large. Maximum size for ${type} is ${mb} MB`);
    }

    if (provider === 'cloudinary') {
      return this.cloudinaryService.upload(file, type, folder);
    }

    // Vercel Blob
    const ext = file.originalname.split('.').pop();
    const prefix = folder ? `${folder}/` : `${type}s/`;
    const pathname = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(pathname, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
    });

    return { url: blob.url, pathname: blob.pathname, size: file.size, provider: 'vercel' };
  }

  async list(
    provider: string = 'cloudinary',
    type?: string,
    prefix?: string,
  ): Promise<{ blobs: BlobListItem[] }> {
    if (provider === 'cloudinary') {
      if (!type) return { blobs: [] };
      const items = await this.cloudinaryService.list(type as UploadType);
      return { blobs: items };
    }

    // Vercel Blob
    const result = await list({ prefix });
    return {
      blobs: result.blobs.map((b) => ({
        url:        b.url,
        pathname:   b.pathname,
        size:       b.size,
        uploadedAt: b.uploadedAt instanceof Date
          ? b.uploadedAt.toISOString()
          : String(b.uploadedAt),
        provider:   'vercel' as const,
      })),
    };
  }

  async delete(url: string, provider: string = 'cloudinary'): Promise<void> {
    if (provider === 'cloudinary') {
      return this.cloudinaryService.delete(url);
    }
    await del(url);
  }
}

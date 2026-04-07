import { Injectable, BadRequestException } from '@nestjs/common';
import { put, del } from '@vercel/blob';

type UploadType = 'image' | 'audio' | 'video' | 'document';

const ALLOWED_MIME: Record<UploadType, string[]> = {
  image:    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  audio:    ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'],
  video:    ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  document: ['application/pdf', 'text/plain'],
};

const MAX_SIZE: Record<UploadType, number> = {
  image:    10 * 1024 * 1024,   // 10 MB
  audio:    50 * 1024 * 1024,   // 50 MB
  video:    200 * 1024 * 1024,  // 200 MB
  document: 20 * 1024 * 1024,   // 20 MB
};

@Injectable()
export class UploadService {
  async upload(
    file: Express.Multer.File,
    type: UploadType,
    folder?: string,
  ): Promise<{ url: string; pathname: string; size: number }> {
    if (!ALLOWED_MIME[type].includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type "${file.mimetype}" for upload type "${type}". Allowed: ${ALLOWED_MIME[type].join(', ')}`,
      );
    }

    if (file.size > MAX_SIZE[type]) {
      const mb = MAX_SIZE[type] / (1024 * 1024);
      throw new BadRequestException(`File too large. Maximum size for ${type} is ${mb} MB`);
    }

    const ext = file.originalname.split('.').pop();
    const prefix = folder ? `${folder}/` : `${type}s/`;
    const pathname = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(pathname, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
    });

    return { url: blob.url, pathname: blob.pathname, size: file.size };
  }

  async delete(url: string): Promise<void> {
    await del(url);
  }
}

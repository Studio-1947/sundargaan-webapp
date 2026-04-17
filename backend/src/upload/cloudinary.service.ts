import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export type UploadType = 'image' | 'audio' | 'video' | 'document';

// Cloudinary resource_type per upload type
const RESOURCE_TYPE: Record<UploadType, 'image' | 'video' | 'raw'> = {
  image:    'image',
  audio:    'video',   // Cloudinary stores audio under 'video'
  video:    'video',
  document: 'raw',
};

function folderFor(type: UploadType): string {
  return `sundargaan/${type}s`;
}

// Parse public_id and resource_type from a Cloudinary URL
// e.g. https://res.cloudinary.com/drgb8w8ak/image/upload/v123/sundargaan/images/file.jpg
function parseUrl(url: string): { publicId: string; resourceType: string } {
  const match = url.match(
    /res\.cloudinary\.com\/[^/]+\/([^/]+)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^/.]+)?$/,
  );
  if (!match) throw new BadRequestException('Invalid Cloudinary URL');
  return { resourceType: match[1], publicId: match[2] };
}

export interface CloudinaryBlob {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
  provider: 'cloudinary';
  publicId: string;
}

@Injectable()
export class CloudinaryService implements OnModuleInit {
  onModuleInit() {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.warn(
        '[CloudinaryService] Missing credentials — CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET must be set as environment variables.',
      );
    }
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key:    CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  async upload(
    file: Express.Multer.File,
    type: UploadType,
    folderOverride?: string,
  ): Promise<{ url: string; pathname: string; size: number; provider: 'cloudinary'; publicId: string }> {
    const resourceType = RESOURCE_TYPE[type];
    const folder = folderOverride ?? folderFor(type);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder, resource_type: resourceType, use_filename: false },
          (error, res) => {
            if (error || !res) reject(error ?? new Error('Cloudinary upload failed'));
            else resolve(res);
          },
        )
        .end(file.buffer);
    });

    return {
      url:       result.secure_url,
      pathname:  result.public_id,
      size:      result.bytes,
      provider:  'cloudinary',
      publicId:  result.public_id,
    };
  }

  async list(type: UploadType): Promise<CloudinaryBlob[]> {
    const resourceType = RESOURCE_TYPE[type];
    const folder = folderFor(type);
    const folderPrefix = folder + '/'; // trailing slash = exact folder, no leakage to adjacent paths

    const result = await cloudinary.api.resources({
      resource_type: resourceType,
      type:          'upload',
      prefix:        folderPrefix,
      max_results:   100,
    });

    return (result.resources ?? [])
      .filter((r: any) => (r.public_id as string).startsWith(folderPrefix))
      .map((r: any) => ({
        url:        r.secure_url,
        pathname:   r.public_id,
        size:       r.bytes,
        uploadedAt: r.created_at,
        provider:   'cloudinary' as const,
        publicId:   r.public_id,
      }));
  }

  async delete(url: string): Promise<void> {
    const { publicId, resourceType } = parseUrl(url);
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as any,
    });
  }

  generateSignature(params: Record<string, any>): { signature: string; timestamp: number; apiKey: string; cloudName: string } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { ...params, timestamp },
      process.env.CLOUDINARY_API_SECRET!,
    );
    return {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    };
  }
}

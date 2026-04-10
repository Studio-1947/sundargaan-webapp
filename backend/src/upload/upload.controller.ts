import {
  Controller, Get, Post, Delete,
  Body, Query, UploadedFile,
  UseInterceptors, ParseFilePipe, MaxFileSizeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { AdminTokenGuard } from '../auth/guards/admin-token.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ── Upload endpoints ──────────────────────────────────────────────────────

  @Post('image')
  @UseGuards(AdminTokenGuard)
  @ApiOperation({ summary: 'Upload an image' })
  @ApiQuery({ name: 'provider', enum: ['vercel', 'cloudinary'], required: false })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Query('provider') qProvider?: string,
    @Body('provider') bProvider?: string,
    @Body('folder') folder?: string,
  ) {
    const provider = bProvider ?? qProvider ?? 'vercel';
    return this.uploadService.upload(file, 'image', provider, folder);
  }

  @Post('audio')
  @UseGuards(AdminTokenGuard)
  @ApiOperation({ summary: 'Upload an audio file' })
  @ApiQuery({ name: 'provider', enum: ['vercel', 'cloudinary'], required: false })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadAudio(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Query('provider') qProvider?: string,
    @Body('provider') bProvider?: string,
    @Body('folder') folder?: string,
  ) {
    const provider = bProvider ?? qProvider ?? 'vercel';
    return this.uploadService.upload(file, 'audio', provider, folder);
  }

  @Post('video')
  @UseGuards(AdminTokenGuard)
  @ApiOperation({ summary: 'Upload a video file' })
  @ApiQuery({ name: 'provider', enum: ['vercel', 'cloudinary'], required: false })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 200 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Query('provider') qProvider?: string,
    @Body('provider') bProvider?: string,
    @Body('folder') folder?: string,
  ) {
    const provider = bProvider ?? qProvider ?? 'vercel';
    return this.uploadService.upload(file, 'video', provider, folder);
  }

  @Post('document')
  @UseGuards(AdminTokenGuard)
  @ApiOperation({ summary: 'Upload a document' })
  @ApiQuery({ name: 'provider', enum: ['vercel', 'cloudinary'], required: false })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Query('provider') qProvider?: string,
    @Body('provider') bProvider?: string,
    @Body('folder') folder?: string,
    @Body() fullBody?: any,
  ) {
    const provider = bProvider ?? qProvider ?? 'vercel';
    return this.uploadService.upload(file, 'document', provider, folder);
  }

  // ── List ──────────────────────────────────────────────────────────────────

  @Get('list')
  @UseGuards(AdminTokenGuard)
  @ApiOperation({ summary: 'List blobs from the given provider' })
  @ApiQuery({ name: 'provider', enum: ['vercel', 'cloudinary'], required: false })
  @ApiQuery({ name: 'type', enum: ['image', 'audio', 'video', 'document'], required: false })
  @ApiQuery({ name: 'prefix', required: false })
  listBlobs(
    @Query('provider') provider = 'vercel',
    @Query('type') type?: string,
    @Query('prefix') prefix?: string,
  ) {
    return this.uploadService.list(provider, type, prefix);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  @Delete()
  @UseGuards(AdminTokenGuard)
  @ApiOperation({ summary: 'Delete a blob by URL' })
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string' }, provider: { type: 'string', enum: ['vercel', 'cloudinary'] } } } })
  delete(
    @Body('url') url: string,
    @Body('provider') provider = 'vercel',
  ) {
    return this.uploadService.delete(url, provider);
  }
}

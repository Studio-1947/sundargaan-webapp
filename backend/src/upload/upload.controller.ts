import {
  Controller, Post, Delete, Body, UploadedFile,
  UseInterceptors, ParseFilePipe, MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload an image (artist photo, thumbnail, archive image)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.uploadService.upload(file, 'image', folder);
  }

  @Post('audio')
  @ApiOperation({ summary: 'Upload an audio file (song, music recording)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadAudio(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.uploadService.upload(file, 'audio', folder);
  }

  @Post('video')
  @ApiOperation({ summary: 'Upload a video file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 200 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.uploadService.upload(file, 'video', folder);
  }

  @Post('document')
  @ApiOperation({ summary: 'Upload a document (PDF, text)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @UploadedFile(new ParseFilePipe({ validators: [new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 })] }))
    file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    return this.uploadService.upload(file, 'document', folder);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a blob by its URL' })
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string' } } } })
  delete(@Body('url') url: string) {
    return this.uploadService.delete(url);
  }
}

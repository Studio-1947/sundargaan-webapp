import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryService],
  exports: [UploadService, CloudinaryService],
})
export class UploadModule {}

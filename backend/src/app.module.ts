import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ArtistsModule } from './artists/artists.module';
import { ArchiveModule } from './archive/archive.module';
import { BookingsModule } from './bookings/bookings.module';
import { UploadModule } from './upload/upload.module';
import { AdminTokenGuard } from './auth/guards/admin-token.guard';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    DatabaseModule,
    ArtistsModule,
    ArchiveModule,
    BookingsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminTokenGuard],
})
export class AppModule {}

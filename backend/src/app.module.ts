import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ArtistsModule } from './artists/artists.module';
import { ArchiveModule } from './archive/archive.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ArtistsModule,
    ArchiveModule,
    BookingsModule,
  ],
})
export class AppModule {}

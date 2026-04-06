import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArtistCategory } from './create-artist.dto';

export class QueryArtistDto {
  @ApiPropertyOptional({ description: 'Search across name, song, instrument, tag' })
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ArtistCategory })
  @IsOptional() @IsEnum(ArtistCategory)
  category?: ArtistCategory;

  @ApiPropertyOptional({ example: 'Gosaba' })
  @IsOptional() @IsString()
  block?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  availability?: boolean;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;
}

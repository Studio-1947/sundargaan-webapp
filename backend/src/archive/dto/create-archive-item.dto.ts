import {
  IsString, IsNotEmpty, IsOptional, IsBoolean,
  IsInt, IsArray, IsEnum, IsUrl, IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ArchiveCategory {
  ARTISTS   = 'artists',
  ARTEFACTS = 'artefacts',
  ART_FORMS = 'art_forms',
}

export enum ArchiveMediaType {
  IMAGE    = 'image',
  AUDIO    = 'audio',
  VIDEO    = 'video',
  DOCUMENT = 'document',
}

export class CreateArchiveItemDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  titleBn?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  descriptionBn?: string;

  @ApiProperty({ enum: ArchiveCategory })
  @IsEnum(ArchiveCategory)
  category: ArchiveCategory;

  @ApiPropertyOptional({ example: 'Gosaba' })
  @IsOptional() @IsString()
  subcategory?: string;

  @ApiProperty({ enum: ArchiveMediaType })
  @IsEnum(ArchiveMediaType)
  mediaType: ArchiveMediaType;

  @ApiProperty()
  @IsUrl()
  mediaUrl: string;

  @ApiPropertyOptional()
  @IsOptional() @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional() @IsUUID()
  artistId?: string;

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional() @IsInt()
  year?: number;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  location?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional() @IsBoolean()
  isPublished?: boolean;
}

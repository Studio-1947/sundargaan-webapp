import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsEnum,
  Min,
  MaxLength,
  IsEmail,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ArtistCategory {
  BAUL         = 'baul',
  FOLK_SINGER  = 'folk_singer',
  INSTRUMENTALIST = 'instrumentalist',
  DANCER       = 'dancer',
  STORYTELLER  = 'storyteller',
  CRAFT_ARTISAN = 'craft_artisan',
}

export class CreateArtistDto {
  @ApiProperty({ example: 'Rahamat Sarkar' })
  @IsString() @IsNotEmpty() @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'রহমত সরকার' })
  @IsString() @IsNotEmpty() @MaxLength(255)
  nameBn: string;

  @ApiProperty({ enum: ArtistCategory })
  @IsEnum(ArtistCategory)
  category: ArtistCategory;

  @ApiProperty({ example: 'Gosaba' })
  @IsString() @IsNotEmpty() @MaxLength(100)
  block: string;

  @ApiProperty({ example: 'Village Satjelia, South 24 Parganas' })
  @IsString() @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'সাতজেলিয়া গ্রাম, দক্ষিণ ২৪ পরগনা' })
  @IsString() @IsNotEmpty()
  addressBn: string;

  @ApiProperty({ example: 'Satjelia' })
  @IsString() @IsOptional() @MaxLength(255)
  village?: string;

  @ApiProperty({ example: 'সাতজেলিয়া' })
  @IsString() @IsOptional() @MaxLength(255)
  villageBn?: string;

  @ApiProperty({ example: 'Satjelia' })
  @IsString() @IsOptional() @MaxLength(255)
  post?: string;

  @ApiProperty({ example: 'সাতজেলিয়া' })
  @IsString() @IsOptional() @MaxLength(255)
  postBn?: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  descriptionBn: string;

  @ApiPropertyOptional({ example: 'Bhatiali Jowar' })
  @IsOptional() @IsString() @MaxLength(255)
  famousSong?: string;

  @ApiPropertyOptional({ example: 'ভাটিয়ালি জোয়ার' })
  @IsOptional() @IsString() @MaxLength(255)
  famousSongBn?: string;

  @ApiPropertyOptional({ type: [String], example: ['Ektara', 'Dotara'] })
  @IsOptional() @IsArray() @IsString({ each: true })
  instruments?: string[];

  @ApiPropertyOptional({ type: [String], example: ['একতারা', 'দোতারা'] })
  @IsOptional() @IsArray() @IsString({ each: true })
  instrumentsBn?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsString({ each: true })
  tagsBn?: string[];

  @ApiPropertyOptional({ example: 15 })
  @IsOptional() @IsInt() @Min(0)
  experience?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean()
  availability?: boolean;

  @ApiPropertyOptional()
  @IsOptional() @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '+91 98765 43210' })
  @IsOptional() @IsString() @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'artist@example.com' })
  @IsOptional() @IsEmail()
  email?: string;
}

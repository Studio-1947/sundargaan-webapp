import {
  IsString, IsNotEmpty, IsOptional, IsEmail, IsUUID, IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  artistId: string;

  @ApiProperty({ example: 'Sanjay Das' })
  @IsString() @IsNotEmpty()
  requesterName: string;

  @ApiProperty({ example: '+91 98765 43210' })
  @IsString() @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: 'booking@example.com' })
  @IsOptional() @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Cultural Festival' })
  @IsString() @IsNotEmpty()
  eventType: string;

  @ApiPropertyOptional({ example: '2025-10-14T10:00:00.000Z' })
  @IsOptional() @IsDateString()
  eventDate?: string;

  @ApiPropertyOptional({ example: 'Rabindra Sadan, Kolkata' })
  @IsOptional() @IsString()
  venue?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  message?: string;
}

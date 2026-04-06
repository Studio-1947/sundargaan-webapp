import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArchiveService } from './archive.service';
import { CreateArchiveItemDto } from './dto/create-archive-item.dto';

class QueryArchiveDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() category?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subcategory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mediaType?: string;
  @ApiPropertyOptional() @IsOptional() @Transform(({ value }) => parseInt(value)) page?: number;
  @ApiPropertyOptional() @IsOptional() @Transform(({ value }) => parseInt(value)) limit?: number;
}

@ApiTags('Archive')
@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  @ApiOperation({ summary: 'List archive items with filters' })
  findAll(@Query() query: QueryArchiveDto) {
    return this.archiveService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single archive item' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.archiveService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new archive item' })
  create(@Body() dto: CreateArchiveItemDto) {
    return this.archiveService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an archive item' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateArchiveItemDto>) {
    return this.archiveService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an archive item' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.archiveService.remove(id);
  }
}

import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { QueryArtistDto } from './dto/query-artist.dto';

class AddSampleWorkDto {
  @IsString() @IsNotEmpty() title: string;
  @IsOptional() @IsString() titleBn?: string;
  @IsString() @IsNotEmpty() type: string;
  @IsUrl() mediaUrl: string;
  @IsOptional() @IsString() thumbnail?: string;
  @IsOptional() @IsString() duration?: string;
}

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  @ApiOperation({ summary: 'List artists with optional filters and pagination' })
  findAll(@Query() query: QueryArtistDto) {
    return this.artistsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single artist with sample works' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new artist' })
  create(@Body() dto: CreateArtistDto) {
    return this.artistsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an artist' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateArtistDto>) {
    return this.artistsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an artist' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistsService.remove(id);
  }

  @Post(':id/sample-works')
  @ApiOperation({ summary: 'Add a sample work to an artist' })
  addSampleWork(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddSampleWorkDto,
  ) {
    return this.artistsService.addSampleWork(id, dto);
  }

  @Delete(':id/sample-works/:workId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a sample work from an artist' })
  removeSampleWork(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('workId', ParseUUIDPipe) workId: string,
  ) {
    return this.artistsService.removeSampleWork(id, workId);
  }
}

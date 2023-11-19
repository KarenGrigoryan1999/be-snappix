import { Controller, Post, Get, UseInterceptors, UploadedFiles, Body, Query } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { MetadataService } from './metadata.service';
import { CreateFileDto } from './dto/create-file.dto';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) { }

  @Get()
  getByEntityId(@Query('entityType') entityType, @Query('entityId') entityId) {
    return this.metadataService.getFiles(entityType, entityId);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: "files", maxCount: 10 }]))
  @Post()
  create(
    @Body() body: CreateFileDto,
    @UploadedFiles()
    files: {
      files?: any[];
    }) {
    return this.metadataService.createFile(files, body);
  }
}

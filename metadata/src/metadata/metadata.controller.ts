import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { MetadataService } from './metadata.service';

@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) { }

  @UseInterceptors(FileFieldsInterceptor([{ name: "files", maxCount: 10 }]))
  @Post()
  create(
    @UploadedFiles()
    files: {
      files?: any[];
    }) {
    return this.metadataService.createFile(files);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as path from 'path';
import * as uuid from "uuid";

import { Metadata } from './entities/metadata.entity';
import { s3 } from 'src/s3.config';

@Injectable()
export class MetadataService {
  constructor(
    @InjectModel(Metadata) private readonly metaDataRepository: typeof Metadata,
  ) { }

  async createFile(userFiles: any) {

    const { files } = userFiles;
    const fileNames = [];
    
    for(const file of files) {
      const filename = `${uuid.v4()}${path.extname(file.originalname)}`;
      fileNames.push(filename);
      s3.Upload({
        buffer: file.buffer,
        name: filename,
      }, "/");
      await this.metaDataRepository.create({
        filename,
      });
    }

    return fileNames;
  }
}

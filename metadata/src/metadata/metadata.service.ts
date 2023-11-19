import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as path from 'path';
import * as uuid from "uuid";

import { Metadata } from './entities/metadata.entity';
import { s3 } from 'src/s3.config';
import { CreateFileDto } from './dto/create-file.dto';
import { EntityType } from './entity-type.constant';

@Injectable()
export class MetadataService {
  constructor(
    @InjectModel(Metadata) private readonly metaDataRepository: typeof Metadata,
  ) { }

  getFiles(entityType: EntityType, entityId: number) {
    return this.metaDataRepository.findAll({
      where: {
        entityId,
        entityType,
      }
    });
  }

  async createFile(userFiles: any, dto: CreateFileDto) {

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
        entityId: dto.entityId,
        entityType: dto.entityType,
      });
    }

    return fileNames;
  }
}

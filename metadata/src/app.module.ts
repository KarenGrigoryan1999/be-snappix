import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { MetadataModule } from './metadata/metadata.module';
import { Metadata } from './metadata/entities/metadata.entity';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.getDatabaseDialect(),
        host: configService.getDatabaseHost(),
        port: configService.getDatabasePort(),
        username: configService.getDatabaseUsername(),
        password: configService.getDatabasePassword(),
        database: configService.getDatabaseName(),
        autoLoadModels: true,
        synchronize: true,
        models: [Metadata],
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    MetadataModule,
  ],
})
export class AppModule {}

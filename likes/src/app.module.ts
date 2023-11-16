import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { LikesModule } from './metadata/likes.module';
import { Like } from './metadata/entities/like.entity';
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
        models: [Like],
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    LikesModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PostsModule } from './posts/posts.module';
import { Post } from './posts/entities/post.entity';
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
        models: [Post],
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    PostsModule,
  ],
})
export class AppModule {}

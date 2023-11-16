import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  getDatabaseDialect(): Dialect {
    return this.nestConfigService.get<Dialect>('DATABASE_DIALECT');
  }

  getDatabaseHost(): string {
    return this.nestConfigService.get<string>('DATABASE_HOST');
  }

  getDatabasePort(): number {
    return this.nestConfigService.get<number>('DATABASE_PORT');
  }

  getDatabaseUsername(): string {
    return this.nestConfigService.get<string>('DATABASE_USER');
  }

  getDatabasePassword(): string {
    return this.nestConfigService.get<string>('DATABASE_PASSWORD');
  }

  getDatabaseName(): string {
    return this.nestConfigService.get<string>('DATABASE_NAME');
  }

  getAcessTokenExpiration(): string {
    return this.nestConfigService.get<string>('ACCESS_TOKEN_EXPIRATION');
  }

  getTokenSecretKey(): string {
    return this.nestConfigService.get<string>('PRIVATE_KEY');
  }

  getHashSalt(): number {
    return this.nestConfigService.get<number>('HASH_SALT');
  }
}

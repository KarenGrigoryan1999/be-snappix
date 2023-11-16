import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { RolesModule } from '../roles/roles.module';
describe('Тестирование сервиса NoteService', () => {
  let service: AuthService;
  let tokenService;
  let testEntity;

  beforeEach(async () => {
    testEntity = {
      id: 1,
      email: 'tast@mail.ru',
      login: 'test',
      password: '1234',
      activation_code: '',
      roles: [
        {
          id: 1,
          value: 'ADMIN',
          description: 'ADMIN',
        },
      ],
    };

    tokenService = new JwtService({
      secret: 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'User',
          useValue: User,
        },
      ],
      imports: [RolesModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Метод генерации токена. Ожидается что результат генерации токена методом будет соответствовать верному результату', async () => {
    const generatedToken = await service.generateToken(testEntity);
    const decodedPayload = tokenService.verify(generatedToken.token);

    expect(generatedToken).toBeInstanceOf(Object);
    expect(decodedPayload.email).toBe(testEntity.email);
    expect(decodedPayload.id).toBe(testEntity.id);
    expect(decodedPayload.roles).toEqual(testEntity.roles);
  });
});

import { EntityType } from 'src/metadata/entity-type.constant';
import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { firstValueFrom } from 'rxjs';

import { RolesService } from '../roles/roles.service';
import { ROLES } from '../roles/constants/roles.constant';
import { CreateUserDto } from '../auth/dto/create-user.dto';

import { User } from './entities/user.entity';
import { ValidationExecption } from 'src/exceptions/validation.exception';
import { ConfigService } from 'src/config/config.service';
import { Role } from 'src/roles/entities/role.entity';
import { IUserInfo } from './interfaces/user-info.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) { }

  async uploadAvatar(userFiles, user) {
    const { files } = userFiles;
    const FormData = require('form-data');
    const formData = new FormData();

    for (let file of files) {
      formData.append('entityType', EntityType.USER);
      formData.append('entityId', user.id);
      formData.append('files', file.buffer, file.originalname);
    }

    await firstValueFrom(this.httpService.post(`http://metadata-service:3004/api/metadata`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }));

    return {
      success: true,
    }
  }

  async createUser(dto: CreateUserDto) {
    if (await this.getUserByEmail(dto.email)) {
      throw new ValidationExecption("Такой Пользователь уже существует");
    }
    const activationCode = uuid.v4();

    const hashPassword = await bcrypt.hash(
      dto.password,
      +this.configService.getHashSalt(),
    );
    const user = await this.userRepository.create({
      ...dto,
      password: hashPassword,
      activation_code: activationCode,
    });

    const role = await this.rolesService.getRoleByValue(ROLES.USER);
    await user.$set('roles', role);
    user.roles = [role];

    return user;
  }

  async getAllUsers(page, perPage) {
    const users = await this.userRepository.findAndCountAll({
      include: { all: true },
      limit: Number(perPage),
      attributes: {
        exclude: ['password'],
      },
      offset:
        Number(page) === 1
          ? 0
          : Number(page) * Number(perPage) - Number(perPage),
    });

    return {
      count: users.count,
      users: users.rows,
    };
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      include: Role
    });
  }

  async getUserById(id: string) {
    const { data: metadata } = await firstValueFrom(this.httpService.get(`http://metadata-service:3004/api/metadata?entityId=${id}&entityType=${EntityType.USER}`));

    const user: IUserInfo = (await this.userRepository.findOne({
      where: { id },
      attributes: { exclude: ['password', 'activation_code'] },
    })).toJSON();

    user.avatar = metadata.length != 0 ? metadata[0].filename : '';

    return user;
  }

  async getUserInfoById(id: string) {
    const user = await this.getUserById(id);

    user.followers = 3;
    user.subscribtions = 4;

    return user;
  }
}

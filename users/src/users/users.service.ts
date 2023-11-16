import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import { RolesService } from '../roles/roles.service';
import { ROLES } from '../roles/constants/roles.constant';
import { CreateUserDto } from '../auth/dto/create-user.dto';

import { User } from './entities/user.entity';
import { ValidationExecption } from 'src/exceptions/validation.exception';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(dto: CreateUserDto) {
    if(await this.getUserByEmail(dto.email)) {
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
    });
  }

  async getUserById(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
  }
}

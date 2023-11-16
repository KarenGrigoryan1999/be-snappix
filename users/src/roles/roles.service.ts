import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ValidationExecption } from '../exceptions/validation.exception';

import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly rolesRepository: typeof Role,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const candidate = await this.rolesRepository.findOne({
      where: { value: dto.value },
    });
    if (candidate == null) {
      return this.rolesRepository.create(dto);
    }
    throw new ValidationExecption('Такая роль уже существует');
  }

  async getRoleByValue(value: string) {
    const role = await this.rolesRepository.findOne({ where: { value } });
    if (role) {
      return role;
    }
    throw new ValidationExecption('Не найдено такой роли');
  }
}

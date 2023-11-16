import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '../users/entities/user.entity';

import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { UserRoles } from './entities/user-roles.entity';

@Module({
  controllers: [],
  providers: [RolesService],
  imports: [SequelizeModule.forFeature([Role, User, UserRoles])],
  exports: [RolesService],
})
export class RolesModule {}

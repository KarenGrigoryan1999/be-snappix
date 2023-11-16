import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

import { User } from '../../users/entities/user.entity';

import { Role } from './role.entity';

interface RolesCreationAttrs {
  value: string;
  description: string;
}

@Table({ tableName: 'user_roles' })
export class UserRoles extends Model<UserRoles, RolesCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: string;
}

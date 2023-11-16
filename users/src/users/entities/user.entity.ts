import { HasOne } from 'sequelize-typescript';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { Role } from '../../roles/entities/role.entity';
import { UserRoles } from '../../roles/entities/user-roles.entity';

interface UserCreationAttrs {
  email: string;
  login: string;
  password: string;
  activation_code: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  login: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  activation_code: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  status: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}

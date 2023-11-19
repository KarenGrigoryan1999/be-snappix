import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { EntityType } from '../entity-type.constant';

interface MetadataCreationAttrs {
  filename: string;
  entityId: number,
  entityType: EntityType,
}

@Table({ tableName: 'metadata' })
export class Metadata extends Model<Metadata, MetadataCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  filename: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  entityId: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  entityType: EntityType;
}

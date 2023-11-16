import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface MetadataCreationAttrs {
  filename: string;
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
}

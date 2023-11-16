import {
  ForeignKey,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { Post } from '../../posts/entities/post.entity';

interface FileInfoCreationAttrs {
  filename: string;
}

@Table({ tableName: 'files' })
export class FileInfo extends Model<FileInfo, FileInfoCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  filename: string;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, allowNull: true })
  postId: number;
}

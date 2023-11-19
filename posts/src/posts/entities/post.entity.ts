import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface PostCreationAttrs {
  text: string;
  userId: number;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;
}

import "reflect-metadata";
import { Optional } from "sequelize";
import {
  Model,
  Table,
  Column,
  AutoIncrement,
  PrimaryKey,
  DataType,
  ForeignKey,
  Default,
  CreatedAt,
  DeletedAt,
  AllowNull,
  BelongsTo,
  BelongsToMany,
  HasMany,
  Max,
} from "sequelize-typescript";
import Users from "./users.js";
import UserPostLikes from "./user_post_likes.js";

interface ScheduleAttributes {
  id: number;
  user_id: number;
  content: string;
  memo?: string;

  isDone: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface ScheduleCreateAttributes extends Optional<ScheduleAttributes, "id"> {}

@Table({
  tableName: "posts",
  timestamps: true,
  paranoid: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt",
})
class Schedule extends Model<ScheduleAttributes, ScheduleCreateAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Users) // 유저 속성이 id가 들어오는게 맞는지 확인
  @Column({ type: DataType.INTEGER })
  declare user_id: number;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare content: string;

  @AllowNull(true)
  @Column({ type: DataType.TEXT })
  declare memo: string | null;

  @Default(false)
  @Column({ type: DataType.BOOLEAN })
  declare isDone: boolean;

  @BelongsTo(() => Users, "user_id")
  declare user: Users;

  @DeletedAt
  @Column(DataType.DATE)
  declare deletedAt: Date;
}

export default Schedule;

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
  AllowNull,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import Users from "./users.js";
import UserPostLikes from "./user_post_likes.js";
import PostImages from "./post_images.js";

interface PostAttributes {
  id: number;
  user_id: number;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  image_count: number;
  createdAt: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

@Table({
  tableName: "posts",
  timestamps: true,
  paranoid: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt",
})
class Posts extends Model<PostAttributes, PostCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  title!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  content!: string;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  likes_count!: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  comments_count!: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT })
  image_count!: number;

  @BelongsToMany(() => Users, () => UserPostLikes)
  likedUsers!: Users[];

  @BelongsTo(() => Users, "user_id")
  user!: Users;

  @HasMany(() => PostImages, {
    foreignKey: "post_id",
    as: "images",
  })
  images!: PostImages[];
}

export default Posts;

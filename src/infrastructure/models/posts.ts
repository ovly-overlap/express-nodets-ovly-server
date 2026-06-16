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

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    | "id"
    | "likes_count"
    | "comments_count"
    | "image_count"
    | "createdAt"
    | "deletedAt"
    | "updatedAt"
  > {}

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
  declare id: number;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  declare user_id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare title: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare content: string;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare likes_count: number;

  @Default(0)
  @Column({ type: DataType.INTEGER })
  declare comments_count: number;

  @Default(0)
  @Column({ type: DataType.SMALLINT })
  declare image_count: number;

  @BelongsToMany(() => Users, () => UserPostLikes)
  declare likedUsers: Users[];

  @BelongsTo(() => Users, "user_id")
  declare user: Users;

  @HasMany(() => PostImages, {
    foreignKey: "post_id",
    as: "images",
  })
  declare images: PostImages[];
}

export default Posts;

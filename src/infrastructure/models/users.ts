import { Optional } from "sequelize";
import {
  Table,
  Model,
  AutoIncrement,
  PrimaryKey,
  Column,
  Unique,
  AllowNull,
  DataType,
  BelongsToMany,
  HasMany,
  NotEmpty,
} from "sequelize-typescript";
import UserFollows from "./user_follows.js";
import Posts from "./posts.js";
import UserPostLikes from "./user_post_likes.js";
import UserFandoms from "./user_fandoms.js";
import Comments from "./comments.js";

interface UserAttributes {
  id: number;
  password: string;
  username: string;
  profile_image_url: string;
  intro: string;
  refreshToken: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  tableName: "users",
  createdAt: "created_at",
  updatedAt: "updated_at",
  timestamps: true,
})
class Users extends Model<UserAttributes, UserCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING })
  declare password: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING(50), unique: true })
  declare username: string;

  @Column({ type: DataType.STRING })
  declare profile_image_url: string | null;

  @Column({ type: DataType.STRING(70) })
  declare intro: string | null;

  @Column({ type: DataType.STRING })
  declare refreshToken: string | null;

  @BelongsToMany(() => Users, () => UserFollows, "follower_id", "following_id")
  declare followings: Users[];

  @BelongsToMany(() => Users, () => UserFollows, "following_id", "follower_id")
  declare followers: Users[];

  @HasMany(() => Posts, "user_id")
  declare posts: Posts[];

  @HasMany(() => Comments, "user_id")
  declare comments: Comments[];

  @HasMany(() => UserFandoms, "user_id")
  declare userFandoms: UserFandoms[];

  @BelongsToMany(() => Posts, () => UserPostLikes)
  declare likedPosts: Posts[];
}

export default Users;

import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";

import Users from "./users.js";
import Posts from "./posts.js";

@Table({
  tableName: "user_hidden_posts",
})
class UserHiddenPosts extends Model {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column(DataType.INTEGER)
  user_id!: number;

  @PrimaryKey
  @ForeignKey(() => Posts)
  @Column(DataType.INTEGER)
  post_id!: number;

  @BelongsTo(() => Users)
  user!: Users;

  @BelongsTo(() => Posts)
  post!: Posts;
}

export default UserHiddenPosts;

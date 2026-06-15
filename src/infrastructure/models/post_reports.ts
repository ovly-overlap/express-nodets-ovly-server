import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import Posts from "./posts.js";
import Users from "./users.js";

@Table({
  tableName: "post_reports",
})
class PostReports extends Model {
  @ForeignKey(() => Posts)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  post_id!: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  reason!: string;

  @BelongsTo(() => Posts)
  post!: Posts;

  @BelongsTo(() => Users)
  user!: Users;
}

export default PostReports;

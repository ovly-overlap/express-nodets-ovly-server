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
  declare post_id: number;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare reason: string;

  @BelongsTo(() => Posts)
  declare post: Posts;

  @BelongsTo(() => Users)
  declare user: Users;
}

export default PostReports;

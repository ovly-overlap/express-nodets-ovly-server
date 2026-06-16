import {
  Model,
  Table,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";

import Posts from "./posts.js";

@Table({
  tableName: "post_images",
  timestamps: false,
})
export default class PostImages extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Posts)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare post_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare url: string;

  @Column(DataType.SMALLINT)
  declare sort_order: number;

  @BelongsTo(() => Posts)
  declare post: Posts;
}

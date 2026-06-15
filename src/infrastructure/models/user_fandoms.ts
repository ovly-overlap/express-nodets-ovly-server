import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Fandoms from "./fandoms.js";
import Users from "./users.js";

@Table({
  tableName: "user_fandoms",
  timestamps: true,
})
class UserFandoms extends Model {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  user_id!: number;

  @PrimaryKey
  @ForeignKey(() => Fandoms)
  @Column({ type: DataType.INTEGER })
  fandom_id!: number;

  @Column({ type: DataType.STRING })
  fandom_image_url!: string;

  @BelongsTo(() => Fandoms, "fandom_id")
  fandom!: Fandoms;

  @BelongsTo(() => Users, "user_id")
  user!: Users;
}

export default UserFandoms;

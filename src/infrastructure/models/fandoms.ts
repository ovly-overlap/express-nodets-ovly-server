import {
  AutoIncrement,
  Model,
  PrimaryKey,
  Table,
  Column,
  HasMany,
  DataType,
} from "sequelize-typescript";
import UserFandoms from "./user_fandoms.js";

@Table({
  tableName: "fandoms",
})
class Fandoms extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @Column({ type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare image_url: string;

  @HasMany(() => UserFandoms)
  declare userFandoms: UserFandoms;
}

export default Fandoms;

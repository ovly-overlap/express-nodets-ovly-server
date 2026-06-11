import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: 'missions',
  timestamp: false,
  paranoid: false
})
class Missions extends Model{
  
  @Column({type: DataType.INTEGER})
}
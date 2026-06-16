import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: 'missions',
  timestamp: false,
  paranoid: false
})
class Missions extends Model{
  
  @Column({type: DataType.INTEGER})
}

// TODO : mission 마스터 테이블에서 userMission 중간 테이블
import {AutoIncrement, Model, PrimaryKey, Table, Column, HasMany, DataType} from "sequelize-typescript";
import UserFandoms from "./user_fandoms.js";

@Table({
    tableName: "fandoms"
})
class Fandoms extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column({type:DataType.STRING})
    id!:number;

    @Column({type:DataType.STRING})
    name!:string;

    @Column({type:DataType.STRING})
    image_url!:string;
    
    @HasMany(()=>UserFandoms)
    userFandoms!:UserFandoms;
}

export default Fandoms;
import {AutoIncrement, Model, PrimaryKey, Table, Column, HasMany} from "sequelize-typescript";
import UserFandoms from "./user_fandoms.ts";

@Table({
    tableName: "fandoms"
})
class Fandoms extends Model{
    @AutoIncrement
    @PrimaryKey
    id!:number;

    @Column
    name!:string;

    @Column
    image_url!:string;
    
    @HasMany(()=>UserFandoms)
    userFandoms!:UserFandoms;
}

export default Fandoms;
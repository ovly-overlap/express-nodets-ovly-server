
import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Fandoms from "./fandoms.ts";
import Users from "./users.ts";

@Table({
    tableName:"user_fandoms",
    timestamps:true,
})
class UserFandoms extends Model{
    @PrimaryKey
    @ForeignKey(()=>Users)
    @Column
    user_id!:number;

    @PrimaryKey
    @ForeignKey(()=>Fandoms)
    @Column
    fandom_id!:number;

    @BelongsTo(()=>Fandoms, "fandom_id")
    fandom!:Fandoms;

    @BelongsTo(()=>Users, "user_id")
    user!:Users;
}

export default UserFandoms;

import {Table, Model, PrimaryKey, ForeignKey, Index} from "sequelize-typescript";
import Users from "./users.ts";

@Table({
    tableName:"user_follows",
    timestamps:true,
    updatedAt: "updated_at",
    createdAt: "created_at",
    validate:{
        isNotSelfFollow(){
            if(this.follower_id === this.following_id){throw new Error("model/userFollows : self following")}
        }
    }
})
class UserFollows extends Model{
    
    @PrimaryKey
    @ForeignKey(()=>Users)
    follower_id!:number;

    @PrimaryKey
    @ForeignKey(()=>Users)
    following_id!:number;

    readonly created_at!:Date;
}

export default UserFollows;
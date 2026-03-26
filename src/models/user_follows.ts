
import {Table, Model, PrimaryKey, ForeignKey, Column, BelongsTo} from "sequelize-typescript";
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
    @Column
    follower_id!:number;

    @PrimaryKey
    @ForeignKey(()=>Users)
    @Column
    following_id!:number;

    readonly created_at!:Date;

    @BelongsTo(() => Users, 'follower_id')
    follower!: Users; // 이 데이터를 만든 사람 객체

    @BelongsTo(() => Users, 'following_id')
    following!: Users; // 팔로우 당한 사람 객체
}

export default UserFollows;
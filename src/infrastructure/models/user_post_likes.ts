import {BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table} from "sequelize-typescript";
import Posts from "./posts.js";
import Users from "./users.js";

@Table({
    tableName: "user_post_likes"
})
class UserPostLikes extends Model{
    @PrimaryKey
    @ForeignKey(()=>Posts)
    @Column({type:DataType.INTEGER})
    post_id!: number; 
    
    @PrimaryKey
    @ForeignKey(()=>Users)
    @Column({type:DataType.INTEGER})
    user_id!: number;
    

    @BelongsTo(()=>Posts, "post_id")
    post!: Posts;
    @BelongsTo(()=>Users, "user_id")
    user!: Users;
}

export default UserPostLikes; 
import {Column, ForeignKey, Index, Model, PrimaryKey, Table} from "sequelize-typescript";
import Posts from "./posts.ts";
import Users from "./users.ts";

@Table({
    tableName: "user_post_likes"
})
class UserPostLikes extends Model{
    // TODO : index 적용 확인
    @Index
    @PrimaryKey
    @ForeignKey(()=>Posts)
    @Column
    post_id!: number; 

    @PrimaryKey
    @ForeignKey(()=>Users)
    @Column
    user_id!: number;
}

export default UserPostLikes;
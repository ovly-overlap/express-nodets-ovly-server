import 'reflect-metadata';
import { Optional } from 'sequelize';
import { Model, Table, Column, AutoIncrement, PrimaryKey, DataType, ForeignKey, Default, CreatedAt, DeletedAt, AllowNull, BelongsTo } from "sequelize-typescript";
import Users from './users.ts';

interface PostAttributes{
    id: number;
    title: string;
    writer: string; // 이거 만든 유저의 id를 적어야하나
    content: string;

}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'>{}


@Table({
    tableName: 'posts',
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at"
})
class Posts extends Model<PostAttributes, PostCreationAttributes>{

    @AutoIncrement
    @PrimaryKey
    @Column({type:DataType.INTEGER})
    id!: number;

    @AllowNull(false)
    @ForeignKey(()=> Users) // 유저 속성이 id가 들어오는게 맞는지 확인
    @BelongsTo(() => Users)
    @Column({type:DataType.INTEGER})
    user_id!: number;

    @AllowNull(false)
    @Column
    content!: string;

    @Default(0)
    @Column
    post_likes_count!: number;

    @Default(0)
    @Column
    comments_count!: number;
    
    readonly created_at!:Date;
    readonly updated_at!:Date;
    readonly deleted_at!:Date;
}

export default Posts;
import 'reflect-metadata';
import {Table, Model, Column, DataType, PrimaryKey, AutoIncrement, Default, AllowNull, ForeignKey, BelongsTo} from 'sequelize-typescript';
import Posts from './posts.js';
import Users from "./users.js";

@Table({
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    deletedAt: 'deleted_at'
})
class Comments extends Model{
    @PrimaryKey
    @AutoIncrement
    @Column({type:DataType.INTEGER})
    id!: number;

    @ForeignKey(()=>Posts)
    @Column({type:DataType.INTEGER})
    post_id!: number;

    @ForeignKey(()=>Users)
    @Column({type:DataType.INTEGER})
    user_id!:number;

    @Default(null)
    @Column({type:DataType.INTEGER})
    parent_id!: number;

    @AllowNull(false)
    @Column({type:DataType.TEXT})
    content!: string;

    readonly created_at: Date;
    readonly deleted_at: Date;

    
    @BelongsTo(()=> Posts)
    post!: Posts;

    @BelongsTo(()=>Users)
    user!: Users;

}

export default Comments;
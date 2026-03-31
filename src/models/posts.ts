import 'reflect-metadata';
import { Optional } from 'sequelize';
import { Model, Table, Column, AutoIncrement, PrimaryKey, DataType, ForeignKey, Default, CreatedAt, DeletedAt, AllowNull, BelongsTo, BelongsToMany, HasMany } from "sequelize-typescript";
import Users from './users.ts';
import UserPostLikes from './user_post_likes.ts';

interface PostAttributes{
    id: number;
    user_id: number;
    title: string;
    content: string;
    post_likes_count: number;
    comments_count: number;
    image_count: number;
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
    @Column({type:DataType.INTEGER})
    user_id!: number;

    @AllowNull(false)
    @Column(DataType.STRING(50))
    title!: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    content!: string;
    
    @Default(0)
    @Column(DataType.NUMBER)
    post_likes_count!: number;
    
    @Default(0)
    @Column(DataType.NUMBER)
    comments_count!: number;

    @Default(0)
    @Column(DataType.SMALLINT)
    image_count!: number;
    
    readonly created_at!:Date;
    readonly updated_at!:Date;
    readonly deleted_at!:Date;
    


    @BelongsToMany(()=>Users, ()=>UserPostLikes)
    likedUsers!: Users[];

    @BelongsTo(() => Users, "user_id")
    user!: Users;

    @HasMany(()=> Posts, "post_id")
    posts!: Posts[];

    // TODO : image 다형성 DB 관계 연결필요 : 꼬이면 어캅니까
}

export default Posts;
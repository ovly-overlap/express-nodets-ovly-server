import { Optional } from 'sequelize';
import { Table, Model, AutoIncrement, PrimaryKey, Column, Unique, AllowNull, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';
import UserFollows from "./user_follows.ts";
import Posts from "./posts.ts";
import UserPostLikes from './user_post_likes.ts';
import UserFandoms from './user_fandoms.ts';

interface UserAttributes {
  id: number;
  password: string;
  profile_image_url: string;
  name: string;
  intro: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
  // when create user, dont need ID type

@Table({
  tableName: "users",
  createdAt: "created_at",
  updatedAt: "updated_at",
  timestamps: true,
})
class Users extends Model<UserAttributes, UserCreationAttributes>{
  static findByToken(token: string, arg1: (err: Error, user: Users) => any) {
    throw new Error("Method not implemented.");
  }

  @AutoIncrement
  @PrimaryKey
  @Column
  id!: number;

  @Column
  password!: string; // 처리 필요

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: string;

  @Column
  profile_image_url!: string;

  @Column(DataType.STRING(70))
  intro!: string;  

  readonly created_at!:Date;



  @BelongsToMany(() => Users, () => UserFollows, 'follower_id', 'following_id')
  followings!: Users[];

  @BelongsToMany(() => Users, () => UserFollows, 'following_id', 'follower_id')
  followers!: Users[];

  @HasMany(()=> Posts, "user_id")
  posts!: Posts[];

  // @HasMany(()=> UserPostLikes, "user_id") 
  // userPostLikes!: UserPostLikes[];

  @HasMany(()=> UserFandoms, "user_id")
  userFandoms!: UserFandoms[];

  @BelongsToMany(()=>Posts, ()=>UserPostLikes)
  likedPosts!: Posts[];
}


export default Users;
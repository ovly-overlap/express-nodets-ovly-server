import { Optional } from 'sequelize';
import { Table, Model, AutoIncrement, PrimaryKey, Column, Unique, AllowNull, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';
import UserFollows from "./user_follows.ts";
import Posts from "./posts.ts";
import UserPostLikes from './user_post_likes.ts';
import UserFandoms from './user_fandoms.ts';

interface UserAttributes {
  id: number;
  password: string;
  name: string;
  intro: string;

}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
  // 만들때 id없어되길 바라며 씀

@Table({
  tableName: "users",
  createdAt: "created_at",
  updatedAt: "updated_at",
  timestamps: true,
})
class Users extends Model<UserAttributes, UserCreationAttributes>{
  static findByToken(token: any, arg1: (err: any, user: any) => any) {
    throw new Error("Method not implemented.");
  }
  @AutoIncrement
  @PrimaryKey
  id!: number;

  @Column
  password!: string; // 처리 필요

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  name!: string;


  @Column(DataType.STRING(70))
  intro!: string;  

  readonly created_at!:Date;


  @BelongsToMany(() => Users, () => UserFollows, 'follower_id', 'following_id')
  followings!: Users[];

  @BelongsToMany(() => Users, () => UserFollows, 'following_id', 'follower_id')
  followers!: Users[];

  @HasMany(()=> Posts, "user_id")
  posts!: Posts[];

  @HasMany(()=> UserPostLikes, "user_id") // TODO: 이렇게 써도 되는건지 확인좀
  userPostLikes!: UserPostLikes[];

  @HasMany(()=> UserFandoms, "user_id")
  userFandoms!: UserFandoms[];

  
}

export default Users;
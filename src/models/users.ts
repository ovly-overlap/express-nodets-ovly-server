import { Optional } from 'sequelize';
import { Table, Model, AutoIncrement, PrimaryKey, Column, Unique, AllowNull, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';
import UserFollows from "./user_follows.js";
import Posts from "./posts.js";
import UserPostLikes from './user_post_likes.js';
import UserFandoms from './user_fandoms.js';
import Comments from "./comments.js";

interface UserAttributes {
  id: number;
  password: string;
  username: string;
  profile_image_url: string;
  intro: string;
  refreshToken: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
  // when create user, dont need ID type
  // TODO : 

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
  password!: string;   

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  username!: string;

  @Column
  profile_image_url!: string;

  @Column(DataType.STRING(70))
  intro!: string;  

  readonly created_at!:Date;

  @Column
  refreshToken!:string;



  @BelongsToMany(() => Users, () => UserFollows, 'follower_id', 'following_id')
  followings!: Users[];

  @BelongsToMany(() => Users, () => UserFollows, 'following_id', 'follower_id')
  followers!: Users[];

  @HasMany(()=> Posts, "user_id")
  posts!: Posts[];

  @HasMany(()=> Comments, "user_id")
  comments!: Comments[];

  @HasMany(()=> UserFandoms, "user_id")
  userFandoms!: UserFandoms[];

  @BelongsToMany(()=>Posts, ()=>UserPostLikes)
  likedPosts!: Posts[];
}


export default Users;
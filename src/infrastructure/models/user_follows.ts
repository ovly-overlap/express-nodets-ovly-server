import {
  Table,
  Model,
  PrimaryKey,
  ForeignKey,
  Column,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import Users from "./users.js";

@Table({
  tableName: "user_follows",
  timestamps: true,
  updatedAt: "updatedAt",
  createdAt: "createdAt",
  deletedAt: "deleteAt",
  validate: {
    isNotSelfFollow() {
      if (this.follower_id === this.following_id) {
        throw new Error("model/userFollows : self following");
      }
    },
  },
})
class UserFollows extends Model {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  follower_id!: number;

  @PrimaryKey
  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  following_id!: number;

  @BelongsTo(() => Users, "following_id")
  followingUser!: Users;

  @BelongsTo(() => Users, "follower_id")
  followerUser!: Users;
}

export default UserFollows;
// import { CreatePostDTO } from "../dto/CreatePostDTO";
// import { PostResponseDTO } from "../dto/PostResponseDTO";
// import { postService } from "../services/post.service";

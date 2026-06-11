import {
  Table,
  Model,
  PrimaryKey,
  ForeignKey,
  Index,
  Column,
  DataType,
} from "sequelize-typescript";
import Users from "./users.js";
import {
  Route,
  Tags,
  Security,
  Controller,
  Post,
  Path,
  Get,
  Query,
  Put,
  Delete,
} from "tsoa";

@Table({
  tableName: "user_follows",
  timestamps: true,
  updatedAt: "updated_at",
  createdAt: "created_at",
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

  readonly created_at!: Date;
}

export default UserFollows;
// import { CreatePostDTO } from "../dto/CreatePostDTO";
// import { PostResponseDTO } from "../dto/PostResponseDTO";
// import { postService } from "../services/post.service";

@Route("posts")
@Tags("Post")
@Security("jwt")
export class PostController extends Controller {
  @Post("{postId}/like")
  public async toggleLikePost(@Path() postId: number, @Request() req: any) {
    const isUserLiked = await postService.toggleLikePost(postId, req.user.id);

    return isUserLiked;
  }

  @Get("{postId}/likes")
  public async getLikedUsersAll(
    @Path() postId: number,
    @Query() cursor?: number,
    @Query() limit: number = 10
  ) {
    const likedUsersInPost = await postService.getPostLikedUserAll(
      postId,
      cursor,
      limit
    );

    return likedUsersInPost;
  }

  @Post()
  public async createPost(@Request() req: any, @Body() body: CreatePostDTO) {
    try {
      const dto = CreatePostDTO.of(body);

      const post = await postService.createPost(req.user.id, dto);

      return PostResponseDTO.from(post);
    } catch (e: any) {
      this.setStatus(400);

      return {
        message: e.message,
      };
    }
  }

  @Get("{postId}")
  public async getPostOne(@Path() postId: number, @Request() req: any) {
    const post = await postService.getPostOne(req.user.id, postId);

    return PostResponseDTO.from(post);
  }

  @Get()
  public async getPostAll(
    @Query() cursor?: number,
    @Query() limit: number = 10
  ) {
    const posts = await postService.getPostAll(cursor, limit);

    return PostResponseDTO.fromList(posts);
  }

  @Put("{postId}")
  public async updatePost(
    @Path() postId: number,
    @Request() req: any,
    @Body()
    body: {
      title: string;
      content: string;
    }
  ) {
    const updatedPost = await postService.updatePost({
      postId,
      userId: req.user.id,
      title: body.title,
      content: body.content,
    });

    return PostResponseDTO.from(updatedPost);
  }

  @Delete("{postId}")
  public async deletePost(@Path() postId: number, @Request() req: any) {
    try {
      const isDeleted = await postService.deletePost(postId, req.user.id);

      return isDeleted;
    } catch (e: any) {
      this.setStatus(400);

      return {
        message: e.message,
      };
    }
  }
}

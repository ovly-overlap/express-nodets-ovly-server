import { PostService } from "@/domain/post/post.service.js";
import { CreatePostDTO, PostResponseDTO } from "@/types/post.dto.js";
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";

@Route("posts")
@Tags("Post")
@Security("jwt")
export class PostController extends Controller {
  constructor(private readonly postService: PostService) {
    super();
  }

  @Post("{postId}/likes")
  public async toggleLikePost(@Path() postId: number, @Request() req: any) {
    const isUserLiked = await this.postService.toggleLikePost(
      postId,
      req.user.id
    );

    return isUserLiked;
  }

  @Get("{postId}/likes")
  public async getLikedUsersAll(
    @Path() postId: number,
    @Query() cursor?: number,
    @Query() limit: number = 10
  ) {
    const likedUsersInPost = await this.postService.getPostLikedUserAll(
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

      const post = await this.postService.createPost(req.user.id, dto);

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
    const post = await this.postService.getPostOne(req.user.id, postId);

    return PostResponseDTO.from(post);
  }

  @Get()
  public async getPostAll(
    @Query() cursor?: number,
    @Query() limit: number = 10
  ) {
    const posts = await this.postService.getPostAll(cursor, limit);

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
    const updatedPost = await this.postService.updatePost({
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
      const isDeleted = await this.postService.deletePost(postId, req.user.id);

      return isDeleted;
    } catch (e: any) {
      this.setStatus(400);

      return {
        message: e.message,
      };
    }
  }
}

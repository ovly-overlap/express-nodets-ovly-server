import GetPostDetailUseCase from "@/application/usecases/get-ovly-detailed-post.usecase.js";
import GetOvlyTimelineUseCase from "@/application/usecases/get-ovly-timeline.usecase.js";
import { PostService } from "@/domain/post/post.service.js";
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
import { CreatePostDTO, PostResponseDTO } from "./dto/post.dto.js";
import GetPostLikedUserCase from "@/application/usecases/get-ovly-post-liked.usecase.js";
import CreatePostUseCase from "@/application/usecases/create-post-usecase.js";
import { AppError } from "@/infrastructure/types/appError.js";
import { Request as ExpressRequest } from "express";

@Route("posts")
@Tags("Post")
@Security("jwt")
export class PostController extends Controller {
  constructor(
    private readonly postService: PostService,
    private readonly getPostLikedUserCase: GetPostLikedUserCase,
    private readonly getPostDetailUseCase: GetPostDetailUseCase,
    private readonly getTimelineUseCase: GetOvlyTimelineUseCase,
    private readonly createPostUseCase: CreatePostUseCase
  ) {
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

  @Post("{postId}/hide")
  public async hidePost(@Path() postId: number, @Request() req: any) {
    await this.postService.hidePost(req.user.id, postId);

    return {
      success: true,
    };
  }

  @Post("{postId}/report")
  public async reportPost(
    @Path() postId: number,
    @Request() req: any,
    @Body()
    body: {
      reason: string;
    }
  ) {
    await this.postService.reportPost(postId, req.user.id, body.reason);

    return {
      success: true,
    };
  }

  @Get("{postId}/likes")
  public async getLikedUsersAll(
    @Request() req: any,
    @Path() postId: number,
    @Query() cursor?: number,
    @Query() limit: number = 10
  ) {
    const likedUsersInPost = await this.getPostLikedUserCase.execute({
      viewerId: req.user.id,
      postId,
      cursor,
      limit,
    });
    return likedUsersInPost;
  }

  @Post()
  public async createPost(@Request() req: any, @Body() body: CreatePostDTO) {
    try {
      const dto = CreatePostDTO.of(body);

      const post = await this.createPostUseCase.execute({
        userId: req.user.id,
        title: dto.title,
        content: dto.content,
        imageUrl: dto.image_url,
      });

      return PostResponseDTO.from(post);
    } catch (e: any) {
      this.setStatus(400);

      return {
        message: e.message,
      };
    }
  }

  @Get("{postId}")
  public async getPostDetail(@Path() postId: number, @Request() req: any) {
    const post = await this.getPostDetailUseCase.execute(postId);
    if (post.post.author.id !== req.user.id) {
      throw new AppError("Forbidden", 403);
    }
    return post;
  }

  @Get()
  public async getPostAll(
    @Request() req: ExpressRequest,
    @Query() cursor: number | null = null,
    @Query() limit: number = 10,
    @Query() type?: "suggest" | "following"
  ) {
    const posts = await this.getTimelineUseCase.execute({
      viewerId: req.user.id,
      cursor,
      limit,
    });
    return posts;
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

    return updatedPost;
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

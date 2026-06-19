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
} from "@tsoa/runtime";
import { CreatePostDTO, PostResponseDTO } from "./dto/post.dto.js";
import GetPostLikedUserCase from "@/application/usecases/get-ovly-post-liked.usecase.js";
import CreatePostUseCase from "@/application/usecases/create-post-usecase.js";
import { AppError } from "@/infrastructure/types/appError.js";
import { Request as ExpressRequest } from "express";
import { LikePostResponse } from "./dto/like-post-response.dto.js";
import { LikedUsersCursorResponse } from "./dto/liked-users-cursor-response-dto.js";
import CommentService from "../comment/comment.service.js";
import UploadsService from "../uploads/upload.service.js";
import GetOvlyTimelineMainUseCase from "@/application/usecases/get-ovly-timeline-main.usecase.js";
import { UsersService } from "../users/users.service.js";

@Route("posts")
@Tags("Post")
@Security("jwt")
export class PostController extends Controller {
  // constructor(
  //   private readonly postService: PostService,
  //   private readonly getPostLikedUserCase: GetPostLikedUserCase,
  //   private readonly getPostDetailUseCase: GetPostDetailUseCase,
  //   private readonly getTimelineUseCase: GetOvlyTimelineUseCase,
  //   private readonly createPostUseCase: CreatePostUseCase
  // ) {
  //   super();
  // }
  private readonly postService = new PostService();

  private readonly commentService = new CommentService();

  private readonly uploadService = new UploadsService();

  private readonly getPostLikedUserCase = new GetPostLikedUserCase(
    this.postService
  );

  private readonly getPostDetailUseCase = new GetPostDetailUseCase(
    this.postService,
    this.commentService
  );

  private readonly getTimelineUseCase = new GetOvlyTimelineUseCase(
    this.postService
  );

  private readonly getMainTimelineUseCase = new GetOvlyTimelineMainUseCase(
    this.postService,
    new UsersService()
  )

  private readonly createPostUseCase = new CreatePostUseCase(
    this.postService,
    this.uploadService
  );

  @Post("{postId}/likes")
  public async toggleLikePost(
    @Path() postId: number,
    @Request() req: any
  ): Promise<LikePostResponse> {
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
    @Request() req: ExpressRequest,
    @Path() postId: number,
    @Query() cursor: number | null = null,
    @Query() limit: number = 10
  ): Promise<LikedUsersCursorResponse> {
    const likedUsersInPost = await this.getPostLikedUserCase.execute({
      viewerId: req.user.id,
      postId,
      cursor,
      limit,
    });
    return {
      items: likedUsersInPost.items,
      nextCursor: likedUsersInPost.nextCursor,
      hasNext: likedUsersInPost.hasNext,
    };
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

  @Get("timeline/main/{type}")
  async getTimeline(
    @Request() req: ExpressRequest,
    @Path() type: "following" | "suggest" = "suggest",
    @Query() cursor?: number,
    @Query() limit: number = 10
  ) {
    const postAndRecommendedFriends = await this.getMainTimelineUseCase.execute({
      viewerId: req.user.id,
      cursor: cursor ?? null,
      limit,
      type
    });
    return postAndRecommendedFriends;
  }

  @Get("timeline/{type}")
  async getFollowingPostAll(
    @Request() req: ExpressRequest,
    @Path() type: "following" | "suggest" = "suggest",
    @Query() cursor?: number,
    @Query() limit: number = 10
  ) {
    const posts = await this.getTimelineUseCase.execute({
      viewerId: req.user.id,
      cursor: cursor ?? null,
      limit,
      type,
    });
    return posts;
  }

  @Get("{postId}")
  public async getPostDetail(@Path() postId: number, @Request() req: any) {
    const post = await this.getPostDetailUseCase.execute(postId);
    if (post.post.author.id !== req.user.id) {
      throw new AppError("Forbidden", 403);
    }
    return post;
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

    return {
      success: true,
    };
  }

  @Delete("{postId}")
  public async deletePost(@Path() postId: number, @Request() req: any) {
    const isDeleted = await this.postService.deletePost(postId, req.user.id);
    return {
      success: isDeleted,
    };
  }
}

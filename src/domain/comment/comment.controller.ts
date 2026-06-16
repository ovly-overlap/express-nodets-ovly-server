import {
  Controller,
  Post,
  Route,
  Security,
  Tags,
  Request,
} from "@tsoa/runtime";
import { Request as ExpressRequest } from "express";
import CommentService from "./comment.service.js";
import { CommentResponse } from "./dto/comment-response.dto.js";
import { AppError } from "@/infrastructure/types/appError.js";
import { ErrorCode } from "@/infrastructure/types/errorCodes.js";

@Route("comment")
@Tags("comment")
@Security("jwt")
export class CommentController extends Controller {
  // constructor(private readonly commentService: CommentService) {
  //   super();
  // }
  private commentService = new CommentService();

  @Post()
  async createComment(
    @Request() req: ExpressRequest
  ): Promise<CommentResponse> {
    const userId = req.user?.id;

    const { postId, content, parentId } = req.body;

    if (!userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401);
    }

    const comment = await this.commentService.createComment(
      userId,
      postId,
      parentId,
      content
    );

    this.setStatus(201);
    return {
      postId: comment.post_id,
      userId: comment.user_id,
      parentId: comment.parent_id,
      content: comment.content,
      likesCount: comment.likes_count,
      author: {
        id: comment.user.id,
        username: comment.user.username,
        profileImageUrl: comment.user.profile_image_url,
      },
    };
  }
}

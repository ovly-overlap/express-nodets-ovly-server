import {
  Controller,
  Post,
  Route,
  Security,
  Tags,
  Request,
  Delete,
  Path,
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

  @Delete("{commentId}")
  async deleteComment(
    @Request() req: ExpressRequest,
    @Path() commentId: number // 💡 삭제하고자 하는 댓글의 고유 ID
  ): Promise<{ message: string; deletedCount: number }> {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401);
    }

    // 서비스 레이어에 삭제 요청 (본인 확인용 userId와 삭제할 commentId 전달)
    const result = await this.commentService.deleteCommentCascade(userId, commentId);

    this.setStatus(200);
    return {
      message: "댓글이 성공적으로 삭제되었습니다.",
      deletedCount: result.deletedCount // 몇 개가 지워졌는지 반환 (본인+자식들)
    };
  }
}

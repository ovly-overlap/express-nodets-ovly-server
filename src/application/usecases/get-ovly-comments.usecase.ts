import CursorResponse from "@/infrastructure/types/cursorResponse.js";
import UseCase from "@/infrastructure/types/UseCase.js";
import { CommentPreview } from "./get-ovly-detailed-post.usecase.js";
import { CommentMapper } from "@/infrastructure/mapper.js";
import CommentService from "@/domain/comment/comment.service.js";

export default class GetPostCommentsUseCase
  implements UseCase<GetPostCommentsRequest, CursorResponse<CommentPreview>>
{
  constructor(private readonly commentService: CommentService) {}

  async execute(
    req: GetPostCommentsRequest
  ): Promise<CursorResponse<CommentPreview>> {
    const result = await this.commentService.findByPostId(
      req.postId,
      req.cursor,
      req.limit
    );

    return {
      items: result.items.map(CommentMapper.toResponse),

      nextCursor: result.nextCursor,

      hasNext: result.hasNext,
    };
  }
}

interface GetPostCommentsRequest {
  postId: number;

  cursor?: number;

  limit?: number;
}

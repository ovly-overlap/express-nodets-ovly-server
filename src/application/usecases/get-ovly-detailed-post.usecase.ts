import CommentService from "@/domain/comment/comment.service.js";
import { PostService } from "@/domain/post/post.service.js";
import { CommentMapper, PostDetailMapper } from "@/infrastructure/mapper.js";
import { AppError } from "@/infrastructure/types/appError.js";
import CursorResponse from "@/infrastructure/types/cursorResponse.js";
import UseCase from "@/infrastructure/types/UseCase.js";

export default class GetPostDetailUseCase
  implements UseCase<number, PostDetailResponse>
{
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService
  ) {}

  async execute(postId: number): Promise<PostDetailResponse> {
    const post = await this.postService.findDetail(postId);
    if (!post) {
      throw new AppError("Not found", 404);
    }

    const comments = await this.commentService.findByPostId(postId, null, 20);

    return {
      post: PostDetailMapper.toResponse(post),

      comments: {
        items: comments.items.map(CommentMapper.toResponse),

        nextCursor: comments.nextCursor,

        hasNext: comments.hasNext,
      },
    };
  }
}

export class PostDetailResponse {
  post!: PostDetail;

  comments!: CursorResponse<CommentPreview>;
}

export class PostDetail {
  id!: number;

  author!: {
    id: number;
    username: string;
    ProfileImageUrl: string | null;
  };

  timeAgo!: string;

  content!: string;

  uploadedImageUrls!: string[];

  likeCount!: number;

  commentCount!: number;
}

export interface CommentPreview {
  id: number;
  parentId: number | null;
  content: string;
  likeCount: number;
  timeAgo: string;

  author: {
    id: number;
    username: string;
    profileImageUrl: string | null;
  };
}

export interface GetPostCommentRequest {
  postId: number;
  page: number;
  size: number;
}

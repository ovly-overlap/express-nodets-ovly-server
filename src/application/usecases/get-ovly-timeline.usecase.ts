import { PostService } from "@/domain/post/post.service.js";
import UseCase from "@/infrastructure/types/UseCase.js";
import { TimelineMapper } from "@/infrastructure/mapper.js";
import CursorResponse from "@/infrastructure/types/cursorResponse.js";


export default class GetOvlyTimelineUseCase
  implements UseCase<GetTimelineRequest, CursorResponse<TimelinePostResponse>> {
  constructor(
    private readonly postService: PostService) { }

  async execute(
    req: GetTimelineRequest
  ): Promise<CursorResponse<TimelinePostResponse>> {
    const result =
      req.type === "suggest"
        ? await this.postService.getPostAll(req.viewerId, req.cursor, req.limit)
        : await this.postService.getPostAllFollowings(
          req.viewerId,
          req.cursor,
          req.limit
        );

    return {
      items: result.items.map(TimelineMapper.toResponse),

      nextCursor: result.nextCursor,

      hasNext: result.hasNext,
    };
  }
}

export class TimelinePostResponse {
  id!: number;
  author!: {
    id: number;
    username: string;
    profileImageUrl: string | null;
  };
  content!: string;
  uploadedImageUrls!: string[] | null;
  likeCount!: number;
  commentCount!: number;
  timeAgo!: string;
}

class GetTimelineRequest {
  viewerId!: number;
  cursor!: number | null;
  limit!: number;
  type!: "following" | "suggest";
}


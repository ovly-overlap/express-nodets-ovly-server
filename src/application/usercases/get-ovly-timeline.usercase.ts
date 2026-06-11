import { PostService } from "@/domain/post/post.service.js";
import { plainToInstance } from "class-transformer";
import UseCase from "@/infrastructure/types/UserCase.js";
import { TimelineMapper } from "@/infrastructure/mapper.js";
import CursorResponse from "@/infrastructure/types/CursorResponse.js";

export default class GetOvlyTimelineUseCase
  implements UseCase<GetTimelineRequest, CursorResponse<TimelinePostResponse>>
{
  constructor(private readonly postService: PostService) {}

  async execute(
    req: GetTimelineRequest
  ): Promise<CursorResponse<TimelinePostResponse>> {
    const result = await this.postService.getPostAll(req.cursor, req.limit);

    return {
      items: result.items.map(TimelineMapper.toResponse),

      nextCursor: result.nextCursor,

      hasNext: result.hasNext,
    };
  }
}

export class TimelinePostResponse {
  username: string;
  userProfileUrl: string;
  timeAge: string;
  content: string;
  uploadedImageUrls: string[];
  likeCount: number;
  commentCount: number;
}

interface GetTimelineRequest {
  cursor?: number;
  limit?: number;
  type?: "suggest" | "following";
}

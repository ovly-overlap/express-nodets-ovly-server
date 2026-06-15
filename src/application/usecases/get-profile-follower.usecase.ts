import CursorResponse from "@/infrastructure/types/cursorResponse.js";
import UseCase from "@/infrastructure/types/UseCase.js";
import { FollowsService } from "@/domain/follows/follows.service.js";

export class GetProfileFollowergUserCase
  implements UseCase<GetFollowingRequest, CursorResponse<FollowerUserPreview>>
{
  constructor(private readonly followService: FollowsService) {}

  async execute(req: GetFollowingRequest) {
    const result = await this.followService.getFollowers(
      req.viewerId,
      req.userId,
      req.cursor,
      req.limit
    );

    return {
      items: result.items,
      nextCursor: result.nextCursor,
      hasNext: result.hasNext,
    };
  }
}

class FollowerUserPreview {
  id: number;
  username: string;
  profileImageUrl: string;
  isFollowing: boolean;
}

class GetFollowingRequest {
  viewerId: number;
  userId: number;
  cursor: Date;
  limit: number;
}

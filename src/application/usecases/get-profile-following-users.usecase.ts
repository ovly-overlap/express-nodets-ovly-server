import CursorResponse from "@/infrastructure/types/cursorResponse.js";
import UseCase from "@/infrastructure/types/UseCase.js";
import { FollowsService } from "@/domain/follows/follows.service.js";
import { FollowingMapper } from "@/infrastructure/mapper.js";

export class GetProfileFollowingUseCase
  implements UseCase<GetFollowingRequest, CursorResponse<FollowingUserPreview>>
{
  constructor(private readonly followService: FollowsService) {}

  async execute(req: GetFollowingRequest) {
    const result = await this.followService.getFollowings(
      req.userId,
      req.cursor,
      req.limit
    );

    return {
      items: result.items.map(FollowingMapper.toResponse),
      nextCursor: result.nextCursor,
      hasNext: result.hasNext,
    };
  }
}

class FollowingUserPreview {
  id!: number;
  username!: string;
  profileImageUrl!: string | null;
}

class GetFollowingRequest {
  userId!: number;
  cursor!: Date | undefined;
  limit!: number;
}

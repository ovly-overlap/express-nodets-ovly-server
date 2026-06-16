import { PostService } from "@/domain/post/post.service.js";
import { LikedUserMapper } from "@/infrastructure/mapper.js";
import CursorResponse from "@/infrastructure/types/cursorResponse.js";
import UseCase from "@/infrastructure/types/UseCase.js";

export default class GetPostLikedUserCase
  implements
    UseCase<GetPostLikedUsersRequest, CursorResponse<LikedUserPreview>>
{
  constructor(private readonly postService: PostService) {}

  async execute(
    req: GetPostLikedUsersRequest
  ): Promise<CursorResponse<LikedUserPreview>> {
    const likedUsers = await this.postService.findLikedUsers(
      req.viewerId,
      req.postId,
      req.cursor,
      req.limit
    );
    return {
      items: likedUsers.items.map(LikedUserMapper.toResponse),
      nextCursor: likedUsers.nextCursor,
      hasNext: likedUsers.hasNext,
    };
  }
}

export class GetPostLikedUsersRequest {
  viewerId!: number;
  postId!: number;
  cursor!: number | null;
  limit!: number;
}

export class LikedUserPreview {
  userId!: number;
  username!: string;
  profileImageUrl!: string | null;
  isFollowing!: boolean;
}

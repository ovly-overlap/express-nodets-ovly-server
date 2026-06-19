import { PostService } from "@/domain/post/post.service.js";
import UseCase from "@/infrastructure/types/UseCase.js";
import { TimelineMapper } from "@/infrastructure/mapper.js";
import CursorResponse from "@/infrastructure/types/cursorResponse.js";
import { UsersService } from "@/domain/users/users.service.js";


export class MainTimelineResponse {
  timeline!: CursorResponse<TimelinePostResponse>;
  recommendedFriends!: RecommendedFriendPreview[];
}

export class RecommendedFriendPreview {
  id!: number;
  username!: string;
  profileImageUrl!: string | null;
  isFollowing!: boolean;
}


export default class GetOvlyTimelineMainUseCase
  implements UseCase<GetTimelineRequest, MainTimelineResponse> {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UsersService,
  ) { }

  async execute(
    req: GetTimelineRequest
  ): Promise<MainTimelineResponse> {
    const timeline =
      req.type === "suggest"
        ? await this.postService.getPostAll(req.viewerId, req.cursor, req.limit)
        : await this.postService.getPostAllFollowings(
          req.viewerId,
          req.cursor,
          req.limit
        );

    const friends = await this.userService.getRecentUnfollowedUsers(req.viewerId);

    return {
      timeline: {
        items: timeline.items.map(TimelineMapper.toResponse),
        nextCursor: timeline.nextCursor,
        hasNext: timeline.hasNext,
      },
      recommendedFriends: friends.map(v => ({
        id: v.id,
        username: v.username,
        profileImageUrl: v.profile_image_url,
        isFollowing: false,
      }))
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


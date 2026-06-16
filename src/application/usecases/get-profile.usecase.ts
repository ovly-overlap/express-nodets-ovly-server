import { FollowsService } from "@/domain/follows/follows.service.js";
import { PostService } from "@/domain/post/post.service.js";
import { ScheduleService } from "@/domain/schedule/schedule.service.js";
import UploadsService from "@/domain/uploads/upload.service.js";
import { UsersService } from "@/domain/users/users.service.js";
import { UserProfileMapper } from "@/infrastructure/mapper.js";
import UseCase from "@/infrastructure/types/UseCase.js";

// TODO : 유저 차단되었는지 확인하는 칼럼
export default class GetProfileUserCase
  implements UseCase<GetProfileRequest, UserProfilePreviewResponse>
{
  constructor(
    private readonly userService: UsersService,
    private readonly postService: PostService,
    private readonly scheduleService: ScheduleService,
    private readonly followsService: FollowsService,
    private readonly uploadService: UploadsService
  ) {}
  async execute(req: GetProfileRequest): Promise<UserProfilePreviewResponse> {
    const [
      user,

      followerCount,
      followingCount,
      isFollowing,

      schedules,
      recentPost,
      calendarPostsImages,
    ] = await Promise.all([
      this.userService.findById(req.userId), // TODO : username 기준의 조회

      this.followsService.countFollowers(req.userId),
      this.followsService.countFollowings(req.userId),
      this.followsService.isFollowing(req.viewerId, req.userId),

      this.scheduleService.findProfilePreview(req.userId, req.targetDate),

      this.postService.findProfileRecentPost(req.userId, req.targetDate),

      this.uploadService.findProfileCalendarImages(req.userId, req.targetDate),
    ]);

    // TODO :userSer > 차단 확인

    return {
      profile: {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profile_image_url,
        intro: user.intro,

        userFandom: user.userFandoms.map((v) => v.fandom_image_url), //TODO : ㅇㄹㄱㄴ
        followingCount: followingCount,
        followerCount: followerCount,
        isFollowing,
      },

      recentPost: recentPost
        ? {
            images: recentPost.images.map((image) => image.url),
            content: recentPost.content,
            date: recentPost.createdAt,
          }
        : null,

      schedules: schedules.map((schedule) => ({
        id: schedule.id,
        content: schedule.content,
        date: schedule.createdAt,
        memo: schedule.memo,
        isDone: schedule.isDone,
      })),

      calendarPosts: calendarPostsImages.map((image) => ({
        imageUrl: image.imageUrl,
        date: image.date,
      })),
    };
  }
}

export class UserProfilePreviewResponse {
  profile!: ProfileSection;
  recentPost!: ProfileRecentPostPreview | null;
  schedules!: SchedulePreview[];
  calendarPosts!: CalendarPostPreview[];
}

interface GetProfileRequest {
  viewerId: number;
  userId: number;
  targetDate: string;
}

export class CalendarPostPreview {
  imageUrl!: string;
  date!: string;
}

export class ProfileSection {
  id!: number;
  username!: string;
  profileImageUrl!: string | null;
  intro!: string | null;
  userFandom!: string[];
  followerCount!: number;
  followingCount!: number;
  isFollowing!: boolean;
}

export class SchedulePreview {
  id!: number;
  content!: string;
  date!: string;
  memo!: string | null;
  isDone!: boolean;
}

export class ProfileRecentPostPreview {
  images!: string[];
  content!: string;
  date!: string;
}

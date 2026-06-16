import Posts from "./models/posts.js";
import { getTimeAge } from "@/utils/getTimeAge.js";
import Comments from "./models/comments.js";
import { LikedUserPreview } from "@/application/usecases/get-ovly-post-liked.usecase.js";
import Users from "./models/users.js";
import UserFollows from "./models/user_follows.js";
import {
  CalendarPostPreview,
  ProfileRecentPostPreview,
  SchedulePreview,
  UserProfilePreviewResponse,
} from "@/application/usecases/get-profile.usecase.js";

export class TimelineMapper {
  static toResponse(post: Posts) {
    return {
      timeAgo: getTimeAge(post.createdAt),

      content: post.content,

      uploadedImageUrls: post.images.map((image) => image.url),

      likeCount: post.likes_count,

      commentCount: post.comments_count,

      author: {
        id: post.user.id,
        username: post.user.username,
        ProfileImageUrl: post.user.profile_image_url,
      },
    };
  }
}

export class CommentMapper {
  static toResponse(comments: Comments) {
    return {
      id: comments.post_id,
      parentId: comments.parent_id,
      content: comments.content,
      likeCount: comments.likes_count,
      timeAgo: getTimeAge(comments.createdAt),

      author: {
        id: comments.user_id,
        username: comments.user.username,
        profileImageUrl: comments.user.profile_image_url,
      },
    };
  }
}

export class PostDetailMapper {
  static toResponse(post: Posts) {
    return {
      id: post.id,
      author: {
        id: post.user.id,
        username: post.user.username,
        ProfileImageUrl: post.user.profile_image_url,
      },
      timeAgo: getTimeAge(post.createdAt),
      content: post.content,
      uploadedImageUrls: post.images.map((image) => image.url),
      likeCount: post.likes_count,
      commentCount: post.comments_count,
    };
  }
}

export class LikedUserMapper {
  static toResponse(item: any): LikedUserPreview {
    return {
      userId: item.id,
      username: item.username,
      profileImageUrl: item.profile_image_url,
      isFollowing: item.isFollowing,
    };
  }
}

export class OvlySearchUsers {
  static toResponse(users: Users) {
    return {
      userId: users.id,
      username: users.username,
      profileImageUrl: users.profile_image_url,
    };
  }
}

export class FollowingMapper {
  static toResponse(follow: UserFollows) {
    return {
      id: follow.followingUser.id,
      username: follow.followingUser.username,
      profileImageUrl: follow.followingUser.profile_image_url,
    };
  }
}

export class UserProfileMapper {
  static toResponse({
    user,
    followerCount,
    followingCount,
    isFollowing,
    schedules,
    recentPost,
    calendarPosts,
  }: {
    user: any;
    followerCount: number;
    followingCount: number;
    isFollowing: boolean;
    schedules: SchedulePreview[];
    recentPost: ProfileRecentPostPreview | null;
    calendarPosts: CalendarPostPreview[];
  }): UserProfilePreviewResponse {
    return {
      profile: {
        id: user.id,
        username: user.username,
        profileImageUrl: user.profile_image_url,
        intro: user.intro,

        followerCount,
        followingCount,
        isFollowing,
        userFandom: user.UserFandoms?.map(
          (uf: any) => uf.Fandoms?.fandoms_image_url
        ),
      },

      recentPost,

      schedules,

      calendarPosts,
    };
  }
}

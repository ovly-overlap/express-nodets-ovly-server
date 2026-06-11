import { TimelinePostResponse } from "@/application/usercases/get-ovly-timeline.usercase.js";
import Posts from "./models/posts.js";
import { getTimeAge } from "@/utils/getTimeAge.js";

export class TimelineMapper {
  static toResponse(post: Posts) {
    return {
      username: post.user.username,

      userProfileUrl: post.user.profile_image_url,

      timeAge: getTimeAge(post.createdAt),

      content: post.content,

      uploadedImageUrls: post.images.map((image) => image.url),

      likeCount: post.likes_count,

      commentCount: post.comments_count,
    };
  }
}

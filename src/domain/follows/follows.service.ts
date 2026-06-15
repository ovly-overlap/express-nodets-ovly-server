import UserFandoms from "@/infrastructure/models/user_fandoms.js";
import sequelize, {
  UserFollows,
  Users,
} from "@/infrastructure/models/index.js";
import { Op } from "sequelize";

export class FollowsService {
  constructor() {}

  public async toggleFollowUser(
    userId: number,
    targetUserId: number
  ): Promise<{ message: string; isFollowing: boolean }> {
    return await sequelize.transaction(async (t: any) => {
      const isFollowed = await UserFandoms.findOne({
        where: {
          userId: userId,
          targetUserId: targetUserId,
        },
        transaction: t,
      });

      if (isFollowed) {
        await isFollowed.destroy({ transaction: t });
        return {
          message: "팔로우 취소",
          isFollowing: false,
        };
      }
      await UserFandoms.create(
        {
          userId: userId,
          targetUserId: targetUserId,
        },
        { transaction: t }
      );

      return {
        message: "팔로우 완료",
        isFollowing: true,
      };
    });
  }

  async getFollowings(userId: number, cursor?: Date, limit: number = 10) {
    const follows = await UserFollows.findAll({
      where: {
        follower_id: userId,

        ...(cursor && {
          createdAt: {
            [Op.lt]: cursor,
          },
        }),
      },

      include: [
        {
          model: Users,
          as: "followingUser",
          attributes: ["id", "username", "profile_image_url"],
        },
      ],

      order: [["createdAt", "DESC"]],

      limit: limit + 1,
    });

    const hasNext = follows.length > limit;

    if (hasNext) {
      follows.pop();
    }

    return {
      items: follows,
      nextCursor:
        follows.length > 0 ? follows[follows.length - 1].createdAt : null,
      hasNext,
    };
  }

  async getFollowers(
    viewerId: number,
    userId: number,
    cursor?: Date,
    limit: number = 10
  ) {
    const follows = await UserFollows.findAll({
      where: {
        following_id: userId,

        ...(cursor && {
          createdAt: {
            [Op.lt]: cursor,
          },
        }),
      },

      include: [
        {
          model: Users,
          as: "followerUser",
          attributes: ["id", "username", "profile_image_url"],
        },
      ],

      order: [["createdAt", "DESC"]],

      limit: limit + 1,
    });

    const hasNext = follows.length > limit;

    if (hasNext) {
      follows.pop();
    }

    // 팔로워 유저 id 목록
    const followerIds = follows.map((follow) => follow.followerUser.id);

    // 내가 그 사람들을 팔로우 중인지 조회
    const myFollowings = await UserFollows.findAll({
      attributes: ["following_id"],
      where: {
        follower_id: viewerId,
        following_id: followerIds,
      },
    });

    const followingSet = new Set(
      myFollowings.map((follow) => follow.following_id)
    );

    return {
      items: follows.map((follow) => ({
        id: follow.followerUser.id,
        username: follow.followerUser.username,
        profileImageUrl: follow.followerUser.profile_image_url,

        isFollowing: followingSet.has(follow.followerUser.id),
      })),

      nextCursor:
        follows.length > 0 ? follows[follows.length - 1].createdAt : null,

      hasNext,
    };
  }

  async countFollowers(userId: number) {
    const counts = await UserFollows.count({
      where: {
        following_id: userId,
      },
    });
    return counts;
  }

  async countFollowings(userId: number) {
    const counts = await UserFollows.count({
      where: {
        follower_id: userId,
      },
    });
    return counts;
  }

  async isFollowing(viewerId: number, userId: number) {
    return !!(await UserFollows.findOne({
      attributes: ["id"], // PK만 조회
      where: {
        follower_id: viewerId,
        following_id: userId,
      },
    }));
  }
}

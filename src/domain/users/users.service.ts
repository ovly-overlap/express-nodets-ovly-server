import { AppError } from "../../infrastructure/types/appError.js";
import Users from "../../infrastructure/models/users.js";
import { Op } from "sequelize";
import sequelize, {
  Fandoms,
  UserFandoms,
  UserFollows,
} from "@/infrastructure/models/index.js";

// TODO : 유저 검색
// TODO 이미지, 팬덤 수정
// TODO : todo 스니펫 추가 + 페이지네이션 다음 페이지 로직 파악
//TODO : t 처리

export class UsersService {
  constructor() { }

  public async findById(id: number): Promise<Users> {
    const user = await Users.findByPk(id, {
      include: [
        {
          model: UserFandoms,
          include: [Fandoms],
        },
      ],
    });
    if (!user) {
      throw new AppError("not found user", 404);
    }
    return user;
  }

  public async getUserById(id: number): Promise<Users> {
    const user = await Users.findByPk(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  public async updateProfileImage(id: number, imageUrl: string): Promise<void> {
    await Users.update({ profile_image_url: imageUrl }, { where: { id } });
  }

  public async updateProfileIntro(
    id: number,
    intro: string,
    newIntro: string
  ): Promise<void> {
    if (intro !== newIntro)
      await Users.update({ intro: newIntro }, { where: { id } });
  }

  public async UpdateOrCreateFandom(
    userId: number,
    newFandomIds: number[]
  ): Promise<void> {
    await sequelize.transaction(async (t) => {
      await UserFandoms.destroy({
        where: { userId: userId },
        transaction: t,
      });
      const bulkData = newFandomIds.map((fandomId) => ({
        user_id: userId,
        fandom_id: fandomId,
      }));
      await UserFandoms.bulkCreate(bulkData, {
        transaction: t,
      });
    });
  }

  public async searchUsersByName(
    keyword: string,
    cursor?: number,
    limit: number = 10
  ): Promise<any> {
    const users = await Users.findAll({
      where: {
        username: {
          [Op.like]: `%${keyword}%`,
        },

        ...(cursor
          ? {
            id: {
              [Op.lt]: cursor,
            },
          }
          : {}),
      },

      order: [["id", "DESC"]],

      limit: limit + 1,
    });

    const hasNext = users.length > limit;

    if (hasNext) {
      users.pop();
    }

    return {
      items: users,

      nextCursor: users.length > 0 ? users[users.length - 1].id : null,

      hasNext,
    };
  }

  async findFandomByUserId(userId: number) {
    return await UserFandoms.findAll({
      where: {
        user_id: userId,
      },
      include: [Fandoms],
    });
  }

  async findFandomByKeyword(userId: number, keyword: string) {
    const joinedFandoms = await UserFandoms.findAll({
      where: {
        user_id: userId,
      },
      attributes: ["fandom_id"],
    });

    const joinedIds = joinedFandoms.map((item) => item.fandom_id);

    return await Fandoms.findAll({
      where: {
        id: {
          [Op.notIn]: joinedIds,
        },
        name: {
          [Op.like]: `%${keyword}%`,
        },
      },
      limit: 20,
    });
  }

  public async getRecentUnfollowedUsers(currentUserId: number): Promise<Users[]> {
    // 1. 현재 내가 팔로우하고 있는 유저 ID 목록 조회
    const followingUsers = await UserFollows.findAll({
      where: { follower_id: currentUserId }, // 내가 팔로우하는 대상들
      attributes: ["following_id"],
    });

    const followingIds = followingUsers.map((follow) => follow.following_id);

    followingIds.push(currentUserId);

    return await Users.findAll({
      where: {
        id: {
          [Op.notIn]: followingIds,
        },
      },
      order: [["createdAt", "DESC"]],
      limit: 4,
    });
  }
}

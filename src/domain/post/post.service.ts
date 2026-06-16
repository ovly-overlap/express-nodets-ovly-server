import sequelize, { UserFollows } from "../../infrastructure/models/index.js";
import { CreatePostDTO, UpdatePostDto } from "./dto/post.dto.js";
import Posts from "../../infrastructure/models/posts.js";
import UserPostLikes from "../../infrastructure/models/user_post_likes.js";
import Users from "../../infrastructure/models/users.js";
import { col, fn, Op, Sequelize, Transaction } from "sequelize";
import PostImages from "@/infrastructure/models/post_images.js";
import { AppError } from "@/infrastructure/types/appError.js";
import PostReports from "@/infrastructure/models/post_reports.js";
import UserHiddenPosts from "@/infrastructure/models/user_hidden_posts.js";

export class PostService {
  public async toggleLikePost(postId: number, userId: number) {
    return await sequelize.transaction(async (t) => {
      const isUserLiked = await UserPostLikes.findOne({
        where: { post_id: postId, user_id: userId },
        transaction: t,
      });

      if (isUserLiked) {
        await isUserLiked.destroy({ transaction: t });
        await Posts.decrement("likes_count", {
          where: { id: postId },
          transaction: t,
        });
        return { liked: false };
      }

      await UserPostLikes.create(
        { post_id: postId, user_id: userId },
        { transaction: t }
      );
      await Posts.increment("likes_count", {
        where: { id: postId },
        transaction: t,
      });
      return { liked: true };
    });
  }

  public async getPostLikedUserAll(
    postId: number,
    cursor?: number,
    limit: number = 10
  ) {
    return await sequelize.transaction(async (t) => {
      const likedUsers = await Users.findAll({
        attributes: ["id", "username"],
        include: [
          {
            model: Posts,
            as: "likedPosts",
            attributes: [],
            where: {
              id: postId,
              ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
            },
            through: { attributes: [] },
          },
        ],
        limit,
        order: [["id", "DESC"]],
        transaction: t,
      });
      return likedUsers;
    });
  }

  private readonly bannedWordRegex =
    /(시발|병신|개새끼|fuck|알페스|나페스|시@발|십알|좆|씨발|ㅄ|ㅂㅅ|ㅅㅂ|tlqkf|지랄|ㅈㄹ|ㅈ같|야한|야하다|대가리|존못|뻐큐|팬픽|멍청|개새|개련|상련|쌍련|방시혁|과즙세연|한남|한녀|죽어|자살|자해|죽여|살해|한강물|투신|우동사리|일베|노무현)/i;

  private containsBannedWord(text: string): boolean {
    return this.bannedWordRegex.test(text);
  }

  public async create(
    userId: number,
    title: string,
    content: string,
    imageUrl: string[],
    t: Transaction
  ) {
    //TODO : 금지어 필터링
    const user = await Users.findByPk(userId, { transaction: t });
    if (!user) throw new AppError("USER_NOT_FOUND", 404);
    if (this.containsBannedWord(content)) {
      throw new AppError("바른 언어 사용을 해주세요", 422);
    }

    // TODO: 알고리즘 파라미터 점수 계산 로직 공간

    const imageCount = imageUrl.length;

    const post = await Posts.create(
      {
        user_id: userId,
        title: title,
        content: content,
        image_count: imageCount,
      },
      { transaction: t }
    );

    // await imageService.createImages(dto.image_url, post.id, post.user_id, t);
    return post;
  }

  public findDetail(postId: number): Promise<Posts | null> {
    return Posts.findByPk(postId, {
      include: [
        {
          model: Users,
          attributes: ["id", "username", "profile_image_url"],
        },
        {
          model: PostImages,
          as: "images",
        },
      ],
    });
  }

  public async getPostAll(
    viewerId: number,
    cursor: number | null,
    limit: number = 10
    // type: string = "suggest" //TODO : 팔로워, 추천 관련 나눠서 뜨게 하기
  ) {
    const hiddenPosts = await UserHiddenPosts.findAll({
      where: {
        user_id: viewerId,
      },
      attributes: ["post_id"],
    });

    const hiddenPostIds = hiddenPosts.map((post) => post.post_id);

    const whereCondition: any = {};

    if (cursor) {
      whereCondition.id = {
        [Op.lt]: cursor,
      };
    }

    if (hiddenPostIds.length > 0) {
      whereCondition.id = {
        ...whereCondition.id,
        [Op.notIn]: hiddenPostIds,
      };
    }

    const posts = await Posts.findAll({
      include: [
        {
          model: PostImages,
          as: "images",
          attributes: ["url"],
        },
        {
          model: Users,
          attributes: ["id", "username", "profile_image_url"],
        },
      ],
      where: whereCondition,
      order: [["id", "DESC"]],
      limit: limit + 1,
    });
    const hasNext = posts.length > limit;

    const items = hasNext ? posts.slice(0, limit) : posts;

    return {
      items,
      hasNext,
      nextCursor: items.length > 0 ? items[items.length - 1].id : null,
    };
  }

  public async getPostAllFollowings(cursor?: number, limit: number = 10) {
    //TODO : 팔로잉한 사람에 대한 스크롤 따로 조회
  }

  public async updatePost(dto: UpdatePostDto) {
    const { postId, userId, ...updateData } = dto;
    const [isUpdated] = await Posts.update(updateData, {
      where: {
        id: postId,
        user_id: userId,
      },
    });

    if (isUpdated === 0) throw new Error("NOT_FOUND_OR_UNAUTHORIZED");

    const post = await Posts.findByPk(postId);

    if (!post) throw new AppError("NOT_FOUND");

    return post;
  }

  public async deletePost(postId: number, userId: number) {
    // TODO : image cascade 삭제
    const post = await Posts.findByPk(postId);
    if (!post) {
      throw new Error("POST_NOT_FOUND");
    }

    if (post.user_id !== userId) {
      throw new Error("UNAUTHORIZED");
    }

    await post.destroy();
    return true;
  }

  async reportPost(postId: number, userId: number, reason: string) {
    return await PostReports.create({
      post_id: postId,
      user_id: userId,
      reason,
    });
  }

  async hidePost(userId: number, postId: number) {
    await UserHiddenPosts.create({
      user_id: userId,
      post_id: postId,
    });
  }

  async findLikedUsers(
    viewerId: number,
    postId: number,
    cursor?: number,
    limit: number = 20
  ) {
    const likes = await UserPostLikes.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "username", "profile_image_url"],
        },
      ],
      where: {
        post_id: postId,
        ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      },
      order: [["createdAt", "DESC"]],
      limit,
    });

    const likedUserIds = likes.map((like) => like.user.id);

    const follows = await UserFollows.findAll({
      attributes: ["following_id"],
      where: {
        userId: viewerId,
        followingId: likedUserIds,
      },
    });

    const followingSet = new Set(follows.map((follow) => follow.following_id));

    const items = likes
      .map((like) => ({
        id: like.user.id,
        username: like.user.username,
        profile_image_url: like.user.profile_image_url,

        isFollowing: followingSet.has(like.user.id),

        likedAt: like.createdAt,
      }))
      .sort((a, b) => {
        // 팔로우한 사람 우선
        if (a.isFollowing !== b.isFollowing) {
          return Number(b.isFollowing) - Number(a.isFollowing);
        }

        // 같은 그룹 내에서는 최신 좋아요 순
        return new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime();
      });

    return {
      items,
      nextCursor: likes.length === limit ? likes[likes.length - 1].id : null,
      hasNext: likes.length === limit,
    };
  }

  async findProfileRecentPost(userId: number, targetDate: string) {
    const start = new Date(`${targetDate}T00:00:00.000+09:00`);
    const end = new Date(`${targetDate}T23:59:59.999+09:00`);

    const post = await Posts.findOne({
      include: {
        model: PostImages,
        as: "images",
      },
      where: {
        user_id: userId,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
      order: [["createdAt", "DESC"]],
    });
    return post;
  }
}

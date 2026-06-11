import sequelize from "../../infrastructure/models/index.js";
import { CreatePostDTO, UpdatePostDto } from "./dto/post.dto.js";
import Posts from "../../infrastructure/models/posts.js";
import UserPostLikes from "../../infrastructure/models/user_post_likes.js";
import Users from "../../infrastructure/models/users.js";
import * as imageService from "../uploads/image.service.js";
import { col, fn, Op } from "sequelize";
import PostImages from "@/infrastructure/models/post_images.js";

// TODO 포스트 게시글 redis 캐싱 / 게시글 파라미터 계산

export class PostService {
  public async toggleLikePost(postId: number, userId: number) {
    return await sequelize.transaction(async (t) => {
      const isUserLiked = await UserPostLikes.findOne({
        where: { post_id: postId, user_id: userId },
        transaction: t,
      });

      if (isUserLiked) {
        await isUserLiked.destroy({ transaction: t });
        await Posts.decrement("post_likes_count", {
          where: { id: postId },
          transaction: t,
        });
        return { liked: false };
      }

      await UserPostLikes.create(
        { post_id: postId, user_id: userId },
        { transaction: t }
      );
      await Posts.increment("post_likes_count", {
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
            where: { id: postId },
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

  public async createPost(userId: number, dto: CreatePostDTO) {
    //TODO : 금지어 필터링
    return await sequelize.transaction(async (t) => {
      const user = await Users.findByPk(userId, { transaction: t });
      if (!user) throw new Error("USER_NOT_FOUND");

      // TODO: 알고리즘 파라미터 점수 계산 로직 공간

      const imageCount = dto.image_url.length;

      const post = await Posts.create(
        {
          user_id: userId,
          title: dto.title,
          content: dto.content,
          image_count: imageCount,
        },
        { transaction: t }
      );

      await imageService.createImages(dto.image_url, post.id, post.user_id, t);
      return post;
    });
  }

  public async getPostOne(postId: number) {
    return await sequelize.transaction(async (t) => {
      const images = await imageService.getPostOneImages(postId, t);
      const post = await Posts.findOne({
        where: { id: postId },
        attributes: ["id", "content", "image_count"],
        order: [["params", "DESC"]],
        transaction: t,
      });
      return { post, images };
    });
  }

  public async getPostAll(
    cursor?: number,
    limit: number = 10,
    type: string = "suggest"
  ) {
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
      where: cursor ? { id: { [Op.lt]: cursor } } : {},
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

  public async updatePost(dto: UpdatePostDto) {
    const { postId, userId, ...updateData } = dto;
    const [isUpdated] = await Posts.update(updateData, {
      where: {
        id: postId,
        user_id: userId,
      },
    });

    if (isUpdated === 0) throw new Error("NOT_FOUND_OR_UNAUTHORIZED");

    return await Posts.findByPk(postId);
  }

  public async deletePost(postId: number, userId: number) {
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

  public async alertPost(postId: number) {
    throw new Error("alertPost");
  }

  public async blockPostandUser(postId: number) {
    throw new Error("blockPostandUser");
  }
}

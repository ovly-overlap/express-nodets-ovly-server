import { Op } from "sequelize";
import Comments from "../../infrastructure/models/comments.js";
import Users from "@/infrastructure/models/users.js";

export default class CommentService {
  public async createComment(
    userId: number,
    postId: number,
    parentId: number | null = null,
    content: string
  ) {
    const comment = await Comments.create({
      user_id: userId,
      post_id: postId,
      parent_id: parentId,
      content: content,
    });

    const createdComment = await Comments.findByPk(comment.id, {
      include: [
        {
          model: Users,
          as: "author",
          attributes: ["id", "username", "profile_image_url"],
        },
      ],
    });

    return createdComment;
  }

  public async findByPostId(
    postId: number,
    cursor?: number | null,
    limit: number = 10
  ) {
    const comments = await Comments.findAll({
      include: [
        {
          model: Users,
          as: "author",
          attributes: ["id", "username", "profile_image_url"],
        },
      ],
      where: {
        postId,
        ...(cursor ? { id: { [Op.lt]: cursor } } : {}),
      },
      order: [["id", "DESC"]],
      limit: limit + 1,
    });

    const hasNext = comments.length > limit;

    if (hasNext) comments.pop();

    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1].id : null;

    return {
      items: comments,
      nextCursor,
      hasNext,
    };
  }
}

import { Op } from "sequelize";
import Comments from "../../infrastructure/models/comments.js";
import Users from "@/infrastructure/models/users.js";
import { AppError } from "@/infrastructure/types/appError.js";
import { ErrorCode } from "@/infrastructure/types/errorCodes.js";

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

    if (!createdComment) throw new AppError(ErrorCode.BAD_REQUEST);

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

  async deleteCommentCascade(userId: number, commentId: number): Promise<{ deletedCount: number }> {
    // 1. 먼저 삭제하려는 댓글이 실제로 존재하는지, 그리고 본인 글이 맞는지 검증합니다.
    const targetComment = await db.comment.findUnique({ where: { id: commentId } });

    if (!targetComment) {
      throw new AppError(ErrorCode.NOT_FOUND, 404); // 댓글 없음
    }
    if (targetComment.user_id !== userId) {
      throw new AppError(ErrorCode.FORBIDDEN, 403); // 본인 글만 삭제 가능
    }

    let deletedCount = 0;

    // 2. 만약 parent_id가 null이다? -> '부모 댓글'이므로 자식 대댓글들도 같이 지워야 합니다 (Cascade)
    if (targetComment.parent_id === null) {
      // 💡 트랜잭션 처리를 하면 더 안전합니다.
      const [deleteReplies, deleteParent] = await db.$transaction([
        // (1) 이 댓글을 parent_id로 가지고 있는 대댓글들(자식) 전부 삭제
        db.comment.deleteMany({
          where: { parent_id: commentId }
        }),
        // (2) 부모 댓글 본인 삭제
        db.comment.delete({
          where: { id: commentId }
        })
      ]);

      deletedCount = deleteReplies.count + 1; // 지워진 대댓글 수 + 자기 자신
    }
    // 3. 만약 parent_id가 존재한다? -> 애초에 '대댓글'이므로 본인만 지우면 끝납니다.
    else {
      await db.comment.delete({
        where: { id: commentId }
      });
      deletedCount = 1;
    }

    return { deletedCount };
  }
}

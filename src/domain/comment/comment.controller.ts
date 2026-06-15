import { Controller, Post, Route, Security, Tags, Request } from "tsoa";
import { Request as ExpressRequest } from "express";
import CommentService from "./comment.service.js";

@Route("comment")
@Tags("comment")
@Security("jwt")
export class CommentController extends Controller {
  constructor(private readonly commentService: CommentService) {
    super();
  }
  // private commentService = new CommentService();

  @Post()
  async createComment(@Request() req: ExpressRequest) {
    const userId = req.user?.id;

    const { postId, content, parentId } = req.body;

    if (!userId) {
      this.setStatus(401);
      return { message: "UNAUTHORIZED" };
    }

    const comment = await this.commentService.createComment(
      userId,
      postId,
      parentId,
      content
    );

    this.setStatus(201);
    return comment;
  }
}

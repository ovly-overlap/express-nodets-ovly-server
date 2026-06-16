import { PostService } from "@/domain/post/post.service.js";
import UploadsService from "@/domain/uploads/upload.service.js";
import sequelize from "@/infrastructure/models/index.js";

export default class CreatePostUseCase {
  // implements UseCase<CreatePostRequest, void>
  constructor(
    private readonly postService: PostService,
    private readonly uploadsService: UploadsService
  ) {}

  async execute(req: CreatePostRequest) {
    const transaction = await sequelize.transaction();

    try {
      const post = await this.postService.create(
        req.userId,
        req.title,
        req.content,
        req.imageUrl,
        transaction
      );

      if (req.imageUrl.length > 0) {
        await this.uploadsService.createPostImages(
          post.id,
          req.imageUrl,
          transaction
        );
      }

      await transaction.commit();

      return post;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

class CreatePostRequest {
  userId: number;
  title: string;
  content: string;
  imageUrl: string[];
}

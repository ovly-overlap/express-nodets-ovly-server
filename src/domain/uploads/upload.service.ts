import { col, fn, Op, Transaction } from "sequelize";
import { randomUUID } from "crypto";
import { getSupabase } from "@/infrastructure/storage/supabase.js";
import { UploadType } from "./enum/UploadType.js";
import { CalendarPostPreview } from "@/application/usecases/get-profile.usecase.js";
import Posts from "@/infrastructure/models/posts.js";
import PostImages from "@/infrastructure/models/post_images.js";

export default class UploadsService {
  private readonly bucketName = "images";

  public async generateUploadUrl(
    userId: number,
    type: UploadType,
    fileName: string,
    contentType: string
  ) {
    this.validateContentType(contentType);
    const path = this.createPath(userId, type, fileName);
    const supabase = getSupabase();

    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .createSignedUploadUrl(path);

    if (error) {
      throw error;
    }

    return {
      uploadToken: data.token,
      path,
    };
  }

  private createPath(userId: number, type: UploadType, fileName: string) {
    const ext = fileName.split(".").pop();

    switch (type) {
      case UploadType.PROFILE:
        return `profiles/${userId}/${randomUUID()}.${ext}`;

      case UploadType.POST:
        return `posts/${userId}/${randomUUID()}.${ext}`;

      default:
        throw new Error("Invalid upload type");
    }
  }

  private validateContentType(contentType: string) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(contentType)) {
      throw new Error("지원하지 않는 이미지 형식입니다.");
    }
  }

  async createPostImages(
    postId: number,
    imageUrls: string[],
    transaction: Transaction
  ) {
    return PostImages.bulkCreate(
      imageUrls.map((url, index) => ({
        post_id: postId,
        image_url: url,
        image_index: index,
      })),
      { transaction }
    );
  }

  // async getOnePostImages(postId: number, t: Transaction) {
  //   return await Images.findAll({
  //     where: { post_id: postId },
  //     transaction: t,
  //   });
  // }

  // async getPostsImages(postIds: number[], t: Transaction){
  //   return postIds.map(async (e) => {
  //     await Images.findAll({ where: { post_id: e }, transaction: t });
  //   });
  // };

  async findProfileCalendarImages(userId: number, targetDate: string) {
    const target = new Date(targetDate);

    const startDate = new Date(target.getFullYear(), target.getMonth(), 1);

    const endDate = new Date(target.getFullYear(), target.getMonth() + 1, 1);

    const posts = await Posts.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        {
          model: PostImages,
          where: {
            image_index: 0,
          },
          required: false,
        },
      ],
      order: [["created_at", "ASC"]],
    });

    const calendarMap = new Map<string, CalendarPostPreview>();

    for (const post of posts) {
      const date = post.createdAt.toISOString().split("T")[0];

      if (calendarMap.has(date)) continue;

      const image = post.images?.[0];

      if (!image) continue;

      calendarMap.set(date, {
        date,
        imageUrl: image.url,
      });
    }

    return Array.from(calendarMap.values());
  }
}

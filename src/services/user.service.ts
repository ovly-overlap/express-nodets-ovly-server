import { AppError, BadRequestError } from "../utils/appError.js";
import Users from "../models/users.js";
import { Op } from "sequelize";
import sequelize, { UserFandoms } from "@/models/index.js";
import { plainToInstance } from "class-transformer";
import {
  UserListResponse,
  UserListResponseDto,
} from "@/controllers/dto/user.req.dto.js";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UserProfileRes } from "@/controllers/dto/user.res.dto.js";

// TODO : 유저 검색
// TODO 이미지, 팬덤 수정
// TODO : todo 스니펫 추가 + 페이지네이션 다음 페이지 로직 파악
//TODO : t 처리

export class UserService {
  constructor() {}

  public async getUserByName(name: string): Promise<UserProfileRes> {
    const user = await Users.findOne({ where: { username: name } });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return plainToInstance(UserProfileRes, user);
  }

  public async getUserById(id: number): Promise<UserProfileRes> {
    const user = await Users.findByPk(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return plainToInstance(UserProfileRes, user);
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
      await Users.update({ intro: intro }, { where: { id } });
  }

  public async UpdateOrCreateFandom(
    userId: string,
    newFandomIds: number[]
  ): Promise<void> {
    await sequelize.transaction(async (t) => {
      UserFandoms.destroy({
        where: { userId: userId },
        transaction: t,
      });
      const bulkData = newFandomIds.map((fandomId) => ({
        userId: userId,
        fandomId: fandomId,
      }));
      await UserFandoms.bulkCreate(bulkData, {
        transaction: t,
      });
    });
  }

  public async toggleFollowUser(
    userId: number,
    targetUserId: number
  ): Promise<{ message: string; isFollowing: boolean }> {
    if (userId === targetUserId)
      throw new BadRequestError("자기 자신 팔로우 ㄴㄴ");

    return await sequelize.transaction(async (t) => {
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

  public async searchUsersByName(
    keyword: string,
    page: number = 1,
    limit: number = 10
  ): Promise<UserListResponseDto> {
    const skip = (page - 1) * limit;
    const findUsers = await Users.findAll({
      where: {
        username: {
          [Op.like]: `%${keyword}$`,
        },
      },
      offset: skip,
      limit: limit,
    });

    const plainUsers = findUsers.map((users) => users.get({ plain: true }));
    const plainResponse = {
      user: plainUsers,
    };
    return plainToInstance(UserListResponseDto, plainResponse, {
      excludeExtraneousValues: true,
    });
  }

  async generateUploadUrl(fileName: string, fileType: string) {
    //TODO : aws s3 logic
    //  rtn - presignedUrl, finalImageUrl
    const s3client = new S3Client({ region: "ap-northeast-2" });
    const uniqueFileName = `profiles/${Date.now()}_${fileName}`;
    const bucketName = "";

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: fileType, // image/jpeg
    });

    const presignUrl = await getSignedUrl(s3client, command, {
      expiresIn: 300,
    });
    const finalImageUrl = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${uniqueFileName}`;
    return { presignUrl, finalImageUrl };
  }
}

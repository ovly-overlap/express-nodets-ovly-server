import express, {
  Response,
  Request as ExpressRequest,
  NextFunction,
} from "express";
import { UserService } from "./user.service.js";
import { AppError } from "../utils/appError.js";
import {
  Get,
  Patch,
  Route,
  Security,
  Request,
  Body,
  Controller,
  Post,
  SuccessResponse,
  Path,
  Query,
} from "tsoa";
import {
  UpdateIntroReq,
  UpdateImageReq,
  UpdateOrCreateFandomReq,
  FollowRequest,
  UserListResponse,
} from "../domain/users/dto/user.req.dto.js";
import { UserProfileRes } from "../domain/users/dto/user.res.dto.js";

@Route("users")
export default class UserController extends Controller {
  constructor(private readonly userService: UserService) {
    super();
  }
  //TODO : 팬덤 자기소개 수정
  // 팔로잉, 팔로워
  // 최애 팬덤 설정
  // 자기소개
  // 프로필 이미지
  //TODO : 특정 사용자 차단 로직
  //TODO : jwt 미들웨어로 방어

  @Get("me") //TODO : 프로필 화면 전체 나오게 하기
  public async getMe(@Request() req: ExpressRequest): Promise<UserProfileRes> {
    const userId = req.user.id; //TODO : id 조작 방어
    return await this.userService.getUserById(userId);
  }

  @Get("{username}")
  public async getUserByName(
    @Path() username: string
  ): Promise<UserProfileRes> {
    return await this.userService.getUserByName(username);
  }

  @Get("search")
  public async searchUsersByName(
    @Query() keyword: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<UserListResponse> {
    //TODO : 반환형 뜨는지 확인
    const result = await this.userService.searchUsersByName(
      keyword,
      page,
      limit
    );
    return result;
  }

  @Security("jwt")
  @Post("me/image/presigned-url")
  public async getPresignedUrl(
    @Body() body: { fileName: string; fileType: string }
  ): Promise<any> {
    const result = await this.userService.generateUploadUrl(
      body.fileName,
      body.fileType
    );
    return { success: true, data: result };
  }

  @Patch("me/image")
  public async updateProfileImage(
    // Presign
    @Request() req: ExpressRequest,
    @Body() requestBody: UpdateImageReq
  ): Promise<any> {
    const userId = Number(req.user.id);
    const imageUrl = requestBody.imageUrl;
    await this.userService.updateProfileImage(userId, imageUrl);
    return { success: true, message: "프로필 변경 완료" };
    //TODO : 공용 api 응답으로 대체
    // ApiResponse.success()
  }

  @Patch("me/intro")
  public async updateProfileIntro(
    @Request() req: ExpressRequest & { user: { id: number } },
    @Body() requestBody: UpdateIntroReq
  ): Promise<void> {
    const userId = req.user.id;
    await this.userService.updateProfileIntro(
      userId,
      requestBody.intro,
      requestBody.newIntro
    );
  }

  @Post("me/fandom")
  @SuccessResponse(201, "Create")
  public async followUser(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() requestBody: UpdateOrCreateFandomReq
  ): Promise<void> {
    const userId = req.user.id;
    const { newFandomIds } = requestBody;
    await this.userService.UpdateOrCreateFandom(userId, newFandomIds);
    this.setStatus(201);
  }

  @Post("{username}/follow")
  @SuccessResponse(204, "No Content")
  public async toggleFollowUser(
    @Request() req: ExpressRequest,
    @Body() requestBody: FollowRequest
  ): Promise<{ message: string; isFollowing: boolean }> {
    const { userId, targetUserId } = requestBody;
    const result = await this.userService.toggleFollowUser(
      userId,
      targetUserId
    );
    this.setStatus(204);
    return result;
  }

  @Get("follower")
  public async getFollower(@Request() req: ExpressRequest): Promise<any> {
    const result = await this.userService.getFollow(req.user.id, true);
    return result;
  }

  @Get("following")
  public async getFollowing(@Request() req: ExpressRequest): Promise<any> {
    const result = await this.userService.getFollow(req.user.id);
    return result;
  }
}

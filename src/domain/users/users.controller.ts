import express, {
  Response,
  Request as ExpressRequest,
  NextFunction,
} from "express";
import { UsersService } from "./users.service.js";
import { AppError } from "../../infrastructure/types/appError.js";
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
} from "./dto/user.req.dto.js";
import { UserProfileRes } from "./dto/user.res.dto.js";
import GetProfileUserCase from "@/application/usecases/get-profile.usecase.js";

@Route("users")
export default class UsersController extends Controller {
  constructor(
    private readonly userService: UsersService,
    private readonly getProfileUseCase: GetProfileUserCase
  ) {
    super();
  }
  //TODO : jwt 미들웨어로 방어

  @Get("{viewerId}")
  public async getUserById(
    @Request() req: ExpressRequest,
    @Path() viewerId: number
  ) {
    return await this.getProfileUseCase.execute({
      viewerId: viewerId,
      userId: req.user.id,
      targetDate: new Date().toISOString().split("T")[0],
    });
  }

  @Get("ovly/search")
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

  @Patch("me/image") // TODO : ;profile image update 문
  public async updateProfileImage(
    // Presign
    @Request() req: ExpressRequest,
    @Body() requestBody: UpdateImageReq
  ): Promise<any> {
    const userId = Number(req.user.id);
    const imageUrl = requestBody.imageUrl;
    await this.userService.updateProfileImage(userId, imageUrl);
    return { success: true, message: "프로필 변경 완료" };
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
}

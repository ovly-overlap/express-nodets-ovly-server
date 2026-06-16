import { Request as ExpressRequest } from "express";
import { UsersService } from "./users.service.js";
import {
  Get,
  Patch,
  Route,
  Request,
  Body,
  Controller,
  Post,
  SuccessResponse,
  Path,
  Query,
} from "@tsoa/runtime";
import {
  UpdateIntroReq,
  UpdateImageReq,
  UpdateOrCreateFandomReq,
  UserListResponse,
} from "./dto/user.req.dto.js";
import GetProfileUserCase from "@/application/usecases/get-profile.usecase.js";
import { PostService } from "../post/post.service.js";
import { ScheduleService } from "../schedule/schedule.service.js";
import { FollowsService } from "../follows/follows.service.js";
import UploadsService from "../uploads/upload.service.js";

@Route("users")
export class UsersController extends Controller {
  private readonly userService = new UsersService();
  private readonly getProfileUseCase = new GetProfileUserCase(
    this.userService,
    new PostService(),
    new ScheduleService(),
    new FollowsService(),
    new UploadsService()
  );

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
    @Request() req: ExpressRequest,
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
  public async updateFandom(
    @Request() req: ExpressRequest,
    @Body() requestBody: UpdateOrCreateFandomReq
  ): Promise<void> {
    const userId = req.user.id;
    const { newFandomIds } = requestBody;
    await this.userService.UpdateOrCreateFandom(userId, newFandomIds);
    this.setStatus(201);
  }
}

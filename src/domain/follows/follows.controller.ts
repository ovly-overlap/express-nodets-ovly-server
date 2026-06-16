import {
  Controller,
  Route,
  Tags,
  Post,
  Get,
  Path,
  Query,
  Request,
  Security,
} from "@tsoa/runtime";
import { FollowsService } from "@/domain/follows/follows.service.js";
import { Request as ExpressRequest } from "express";
import { FollowersResponseDto } from "./dto/follower-users-response.dto.js";
import { GetProfileFollowingUseCase } from "@/application/usecases/get-profile-following-users.usecase.js";
import { GetProfileFollowerUseCase } from "@/application/usecases/get-profile-follower.usecase.js";

@Route("follows")
@Tags("Follows")
export class FollowsController extends Controller {
  // constructor(
  //   private readonly followsService: FollowsService,
  //   private readonly getProfileFollowingUseCase: GetProfileFollowingUseCase,
  //   private readonly getProfileFollowerUseCase: GetProfileFollowerUseCase
  // ) {
  //   super();
  // }

  private readonly followsService = new FollowsService();
  private readonly getProfileFollowingUseCase = new GetProfileFollowingUseCase(
    this.followsService
  );
  private readonly getProfileFollowerUseCase = new GetProfileFollowerUseCase(
    this.followsService
  );

  // TODO : 여기 바꾸삼

  @Security("jwt")
  @Post("{userId}")
  public async toggleFollow(
    @Request() req: ExpressRequest,
    @Path() userId: number
  ): Promise<{ message: string; isFollowing: boolean }> {
    return await this.followsService.toggleFollowUser(req.user.id, userId);
  }

  @Get("followers/{viewerId}")
  public async getFollowers(
    @Request() req: ExpressRequest,
    @Path() viewerId: number,
    @Query() cursor: string,
    @Query() limit: number = 10
  ): Promise<FollowersResponseDto> {
    const followingUser = await this.getProfileFollowerUseCase.execute({
      viewerId,
      userId: req.user.id,
      cursor: cursor ? new Date(cursor) : undefined,
      limit,
    });
    return followingUser;
  }

  @Get("followings/{viewerId}")
  public async getFollowings(
    @Request() req: ExpressRequest,
    @Query() cursor: string,
    @Query() limit: number = 10
  ) {
    const followingUsers = await this.getProfileFollowingUseCase.execute({
      userId: req.user.id,
      cursor: cursor ? new Date(cursor) : undefined,
      limit,
    });
    return followingUsers;
  }

  @Get("counts/{userId}")
  public async getFollowCounts(@Path() userId: number) {
    const [followers, followings] = await Promise.all([
      this.followsService.countFollowers(userId),
      this.followsService.countFollowings(userId),
    ]);

    return {
      followers,
      followings,
    };
  }

  @Get("status/{userId}")
  public async isFollowing(
    @Request() req: ExpressRequest,
    @Path() userId: number
  ) {
    const isFollowing = await this.followsService.isFollowing(
      req.user.id,
      userId
    );

    return {
      isFollowing,
    };
  }
}

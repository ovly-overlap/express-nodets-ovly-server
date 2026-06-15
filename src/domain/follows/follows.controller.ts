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
} from "tsoa";
import { FollowsService } from "@/domain/follows/follows.service.js";
import { Request as ExpressRequest } from "express";

@Route("follows")
@Tags("Follows")
export class FollowsController extends Controller {
  private followsService = new FollowsService();

  @Security("jwt")
  @Post("{userId}")
  public async toggleFollow(
    @Request() req: ExpressRequest,
    @Path() userId: number
  ) {
    return await this.followsService.toggleFollowUser(req.user.id, userId);
  }

  @Get("followers/{userId}")
  public async getFollowers(
    @Request() req: ExpressRequest,
    @Path() userId: number,
    @Query() cursor?: string,
    @Query() limit: number = 10
  ) {
    return await this.followsService.getFollowers(
      req.user.id,
      userId,
      cursor ? new Date(cursor) : undefined,
      limit
    );
  }

  @Get("followings/{userId}")
  public async getFollowings(
    @Path() userId: number,
    @Query() cursor?: string,
    @Query() limit: number = 10
  ) {
    return await this.followsService.getFollowings(
      userId,
      cursor ? new Date(cursor) : undefined,
      limit
    );
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

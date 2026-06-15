import { Expose, Type } from "class-transformer";

//TODO : 유효성 검사
export interface UpdateIntroReq {
  intro: string;
  newIntro: string;
}

export interface UpdateImageReq {
  imageUrl: string;
}

export interface UpdateOrCreateFandomReq {
  newFandomIds: number[];
}

export interface FollowRequest {
  userId: number;
  targetUserId: number;
}

export interface UserListResponse {
  users: Array<{
    id: number;
    username: string;
    profileIdx: string;
    profileUrl: string;
  }>;
}

export class UserItemDto {
  @Expose()
  id!: number;

  @Expose()
  username!: string;

  @Expose()
  profileIdx!: string;

  @Expose()
  profileUrl!: string;
}

export class UserListResponseDto {
  @Expose()
  @Type(() => UserItemDto)
  users!: UserItemDto[];
}

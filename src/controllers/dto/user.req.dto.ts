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

// 1. 배열 내부에 들어갈 개별 유저 오브젝트 클래스
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

// 2. 최종 리턴할 응답 클래스
export class UserListResponseDto {
  @Expose()
  @Type(() => UserItemDto) // 💡 중요: 배열 내부 요소의 타입을 지정해줍니다.
  users!: UserItemDto[];
}

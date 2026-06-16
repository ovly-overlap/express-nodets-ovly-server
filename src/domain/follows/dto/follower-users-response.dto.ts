export class FollowerPreviewDto {
  id!: number;
  username!: string;
  profileImageUrl!: string | null;
  isFollowing!: boolean;
}

export class FollowersResponseDto {
  items!: FollowerPreviewDto[];
  nextCursor!: string | null;
  hasNext!: boolean;
}

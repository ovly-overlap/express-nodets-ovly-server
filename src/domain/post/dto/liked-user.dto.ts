// dto/liked-user.dto.ts

export class LikedUserPreviewDto {
  userId!: number;
  username!: string;
  profileImageUrl!: string | null;
  isFollowing!: boolean;
}

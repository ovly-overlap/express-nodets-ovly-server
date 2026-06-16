import { LikedUserPreviewDto } from "./liked-user.dto.js";

export class LikedUsersCursorResponse {
  items!: LikedUserPreviewDto[];
  nextCursor!: number | null;
  hasNext!: boolean;
}

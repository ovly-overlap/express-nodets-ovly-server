export class CommentResponse {
  postId!: number;
  userId!: number;
  parentId!: number;
  content!: string;
  likesCount!: number;
  author!: {
    id: number;
    username: string;
    profileImageUrl: string | null;
  };
}

import Posts from "../models/posts.ts";

export class CreatePostDTO{
    title!:string;
    // user_id:string;
    content!: string;
    image_url!: string[];
    // id, post_likes_count=0, comments_count=0
    // created_at, updated_at=X, deleted_at=X

    static of(body: any): CreatePostDTO {
        const dto = new CreatePostDTO();
        dto.title = body.title;
        dto.content = body.content;
        dto.image_url = body.image_url;
        this.validate(dto);
        return dto;
    }
    static validate(dto: CreatePostDTO){
        if(!dto.title || dto.title.trim() === ""){
            throw new Error("post title required");
        }
        if(!dto.content || dto.content.trim() === ""){
            throw new Error("post content required");
        }
        if(dto.title.length >= 300 || dto.content.length >= 3000){
            throw new Error("too long title or content");
        }
    }
}

export class UpdatePostDto {
  postId: number;
  userId: number;
  title: string;
  content: string;
}

export class PostResponseDTO {
    id!: number;
    title!: string;
    content!: string;
    likeCount!: number;
    commentCount!: number;
    imageCount?: number;

    static from(post: Posts) : PostResponseDTO{
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            likeCount: post.post_likes_count,
            commentCount: post.comments_count,
            imageCount: post.image_count // 문제 발생 가능성
        }
    }
    static fromList(posts: Posts[]): PostResponseDTO[] {
        return posts.map(post => this.from(post));  
    }
}

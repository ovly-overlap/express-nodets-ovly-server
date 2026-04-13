import Posts from "../models/posts.js";
// import {ImagesPostResponseDTO} from "./image.dto.js";

class PostDto{
    userId?: number;
    postId: number;

    title: string;
    content: string;

    image_url?: string[]; // 널 가능성 있음
}

export class CreatePostDTO extends PostDto{
    static of(body: any): CreatePostDTO {
        const dto = new CreatePostDTO();
        dto.title = body.title;
        dto.content = body.content;
        dto.image_url = body.image_url??[];
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
  image_url: string[];
}

export class PostResponseDTO extends PostDto {
    // id!: number;
    // title!: string;
    // content!: string;
    likeCount!: number;
    commentCount!: number;
    // imageCount?: number;
    // imageUrls?: string[];

    static from(post: Posts, imageUrls: string[]) : PostResponseDTO{
        return {
            postId: post.id,
            userId: post.user_id,
            title: post.title,
            content: post.content,
            likeCount: post.post_likes_count,
            commentCount: post.comments_count,
            image_url: imageUrls
        }
    }
    static fromList(posts: Posts[][], imageUrls: string[][]): PostResponseDTO[] {
        return posts.map(
            (post, i) => this.from(post[i], imageUrls[i])
        );   // 이거 될까될까될까?될까?될까?
    }
}

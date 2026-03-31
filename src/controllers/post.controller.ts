import { CreatePostDTO, PostResponseDTO } from "../dto/post.dto.js";
import * as postService from "../services/post.service.js";
import {Request, Response} from "express";

// TODO : 데이터 유효성 확인 & 데이터 안정성 확인
// TODO : refactor : 라우터에서 app.use() 미들웨어로 try-catch 전역처리

export const toggleLikePost = async (req: Request, res:Response) =>{
    const isUserLiked = await postService.toggleLikePost(Number(req.params.postId), req.user.id);
    res.json(isUserLiked);
}

export const getLikedUsersAll = async (req: Request, res: Response) =>{
    const cursor = req.params.cursor ? Number(req.params.cursor) : undefined;
    const limit = req.params.limit ? Number(req.params.limit) : 10;
    const postId = Number(req.params.postId);
    const likedUsersinPost = await postService.getLikedUserAll(postId, cursor, limit);
    res.json(likedUsersinPost);
}

export const createPost = async (req: Request, res: Response) => {
    try{
        const dto = CreatePostDTO.of(req.body);
        const post = await postService.createPost(req.user.id, dto);
        res.json(PostResponseDTO.from(post));
    } catch (e){
        res.status(400).json({message: e.message});
    }
}

export const getPostOne = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const postId = Number(req.params.postId);

    const post = await postService.getPostOne(userId, postId);
    res.json(PostResponseDTO.from(post));
}

// TODO : 클라이언트 간 > 커서 단위로 무한 스크롤 확인
// TODO : 가져올때 사용자가 좋아요 눌렀는지 확인 하기
export const getPostAll = async (req: Request, res: Response) => {
    const cursor = req.params.cursor ? Number(req.params.cursor) : undefined;
    const limit = req.params.limit ? Number(req.params.limit) : 10;

    const posts = await postService.getPostAll(cursor, limit); // 오류 가능성
    res.json(PostResponseDTO.fromList(posts));
}

export const updatePost = async (req:Request, res:Response) => {
    const userId = req.user.id;
    const postId = Number(req.params.postId);
    const {title, content} = req.body;

    const updatedPost = await postService.updatePost({
        postId, userId, title, content
    });
    res.json(PostResponseDTO.from(updatedPost));
}

export const deletePost = async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);
    try{
        let isDeleted = await postService.deletePost(postId, req.user.id);
        res.json(isDeleted);
        
    } catch (e){
        res.status(400).json({message: e.message});
    }
}

// TODO : 유저의 블락 테이블을 만들어야하나.. 
// export const blockPost = async (req: Response, res: Response) => {

// }

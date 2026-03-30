import * as postService from "../services/post.service.ts";
import {Request, Response} from "express";

// TODO : 데이터 유효성 확인 & 데이터 안정성 확인

export const createLikes = async (req: Request, res:Response) =>{
        
}

export const createPost = async (req: Request, res: Response) => {
    // TODO : 정규식 이용해서 게시글 카테고리 분류
    try{
        const isCreatedPost = postService.createPost(req.user.id);
        res.json(isCreatedPost);
    } catch (e){
        res.json(e);
    }
}

export const getPostOne = async (req: Request, res: Response) => {
    const userId = req.user.id;
    const postId = Number(req.params.postId);

    const post = await postService.getPostOne(userId, postId);
    res.json(post);
}

// TODO : 커서 단위로 무한 스크롤 제공
export const getPostAll = async (req: Request, res: Response) => {
    const cursor = req.params.cursor ? Number(req.params.cursor) : undefined;
    const limit = req.params.limit ? Number(req.params.limit) : 10;

    const posts = await postService.getPostAll(cursor, limit); // 오류 가능성
    res.json(posts);
}

// TODO : try-catch해서 안정성
export const updatePost = async (req:Request, res:Response) => {
    const userId = req.user.id;
    const postId = Number(req.params.postId);
    const {title, content} = req.body;

    const updatedPost = await postService.updatePost({
        postId, userId, title, content
    });
    res.json(updatedPost);
}

export const deletePost = async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);
    try{
        let isDeleted = await postService.deletePost(postId, req.user.id);
        res.json(isDeleted);
        
    } catch (e){
        res.json(e);
    }
}

// export const getLikedPosts = async (req, res) => {
//   const userId = req.user.id;

//   const result = await postService.getLikedPosts(userId);

//   res.json(result);
// };
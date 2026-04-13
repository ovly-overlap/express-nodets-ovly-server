import sequelize from "../models/index.js";
import { CreatePostDTO, UpdatePostDto } from "../dto/post.dto.js";
import Posts from "../models/posts.js";
import UserPostLikes from "../models/user_post_likes.js";
import Users from "../models/users.js";
import * as imageService from "./image.service.js";

import {col, fn, Op, Sequelize, Transaction} from "sequelize";

// TODO : Posts -> PostsDTO


export const toggleLikePost = async (postId: number, userId: number) =>{
    // TODO : 트랜잭션 작동 확인
    await sequelize.transaction(async (t)=>{
        const isUserLiked = await UserPostLikes.findOne({where:{post_id:postId, user_id:userId}, transaction: t})
        if(isUserLiked){
            await isUserLiked.destroy({transaction:t});
            await Posts.decrement("post_likes_count", {where: {id: postId}, transaction:t});
            return {liked: false};
        }
    
        await UserPostLikes.create({where: {post_id:postId, user_id:userId}, transaction:t});
        await Posts.increment("post_likes_count", {where:{id:postId}, transaction:t});
    })
    return {liked: true}; 
}

export const getPostLikedUserAll = async (postId:number, cursor?: number, limit: number = 10) => {
    await sequelize.transaction(async (t) =>{
        const likedUsers = await Users.findAll({
            attributes: ['id', 'name'],
            include: [{
                model: Posts,
                as: 'likedPosts',
                attributes: [],
                where: {id: postId},
                through: {attributes: []}
            }],
            limit,
            order: [["id", "DESC"]],
            transaction:t
        });
        return likedUsers;
    })
}

export const createPost = async (userId: number, dto:CreatePostDTO): Promise<[post:Posts, postImages:string[]]> =>{
    return await sequelize.transaction(async (t)=>{
        // TODO : 유저 게시글의 카테고리 정규화해서 테이블에 넣기
        // TODO : 게시글 제목, 내용, 사진 검토
        // TODO : 내용 정규식 이용해서 게시글 카테고리 분류
        // TODO : 사진 관련 처리
        // if(await Users.findByPk(userId)){throw new Error("not exist user")}; // TODO : 이거 추후 리팩토링
        // return await Posts.findOrCreate({where: {id:userId}});
        const user = await Users.findByPk(userId, {transaction:t});
        if (!user) throw new Error("USER_NOT_FOUND");
        
        // 게시글의 제목, 내용, 사진 클린 검토 
        
        // 유저 게시글 제목, 내용 정규화 해서 카테고리 정리
    
        // 카테고리, 댓글 수, 하트수, 이미지의 적합도 (인물 혹은 이미지가 많으면 굿.) 등으로 파라미터 알고리즘 값 주기 (높을수록 노출도)
    
        const post: Posts = await Posts.create({
            user_id: userId,
            title: dto.title,
            content: dto.content,
            // image_url: dto.image_url,
        }, {transaction:t});
        
        // 이미지 
        const postImages = await imageService.createImages(
            dto.image_url, 
            post.id, 
            post.user_id, 
            t
        );
        
        return [post, postImages.map(v=>v.image_url)];
    });
}

export const getPostOne = async (postId: number): Promise<[post:Posts, postImages:string[]]> =>{
    return await sequelize.transaction(async (t)=>{
        const images = await imageService.getPostOneImages(postId, t);
        const post = await Posts.findOne({
            // where: {id:postId},
            attributes:["id", "content", "image_count"],
            order: [['params', 'DESC']],
            transaction:t
        });
        return [post, images.map(v=>v.image_url)]; 
    });
    
    // const posts = await Posts.findAll({
    //     attributes:[
    //         "id", "title", [fn("COUNT", col("likedUsers.id")), "likeCount"]
    //     ],
    //     include: [
    //         {
    //             model: Users,
    //             as: "likeUsers",
    //             attributes: [],
    //             through: { attributes:[] }
    //         }
    //     ],
    //     group: ["posts.id"]
    // });
}

export const getPostAll = async (cursor?: number, limit: number = 10): Promise<{ post: Posts; images: string[] }[]> => {
    // TODO : 노출 파라미터를 통한 정렬
    return await sequelize.transaction(async (t)=>{
        const where = cursor ? {id: {[Op.lt]: cursor}} : {};
        const posts = await Posts.findAll({
            where, 
            order: [["id", "DESC"]], 
            limit, 
            transaction:t  
        });
        const images = (await imageService.getPostsImages(posts.map(v=>v.id), t)).map(v=>v.map(v1=>v1.image_url));
        const imageMap = new Map<number, string[]>;
        images.forEach((img) => {
            if (!imageMap.has(img.post_id)) {
                imageMap.set(img.post_id, []);
            }
            imageMap.get(img.post_id)!.push(img.image_url);
        });
        // return [posts, imageMap]; // 여기 고쳐요 ㅈ ㅂ
        return posts.map((post)=>({
            post, images: imageMap.get(post.id) || []
        }));
    });
}

export const updatePost = async (dto : UpdatePostDto) => {
    const {postId, userId, ...updateData} = dto;
    const [isUpdated] = await Posts.update(updateData, {
        where: {
            id:postId, 
            user_id:userId
        }
    });
    if(isUpdated===0) throw new Error("not found User or Auth");

    return await Posts.findByPk(postId);
}

export const deletePost = async (postId: number, userId: number) => {
    let post = await Posts.findByPk(postId);
    if(post.user_id === userId){
        return await Posts.destroy({where: {id:postId}})
    }
    if (!post) {
        throw new Error("Post not found");
    }
    await post.destroy();

    return true;
}
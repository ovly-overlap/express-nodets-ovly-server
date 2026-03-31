import { CreatePostDTO, UpdatePostDto } from "../dto/post.dto.js";
import Posts from "../models/posts.js";
import UserPostLikes from "../models/user_post_likes.js";
import Users from "../models/users.js";

import {col, fn, Op} from "sequelize";\


export const toggleLikePost = async (postId: number, userId: number) =>{
    // TODO : 트랜잭션 작동 확인
    const isUserLiked = await UserPostLikes.findOne({where:{post_id:postId, user_id:userId}})
    if(isUserLiked){
        await isUserLiked.destroy();
        await Posts.decrement("post_likes_count", {where: {id: postId}});
        return {liked: false};
    }

    await UserPostLikes.create({where: {post_id:postId, user_id:userId}});
    await Posts.increment("post_likes_count", {where:{id:postId}});
    return {liked: true}; 
}

export const getLikedUserAll = async (postId:number, cursor?: number, limit: number = 10) => {
    //  order : created
    // const resultOfLikedUsers = await UserPostLikes.findAll({
    //     where: {
    //         id:{[Op.lt]: cursor},
    //         post_id: postId,
    //     },
    //     limit: limit,
    // }).map(user_id);
    // return resultOfLikedUsers;
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
        order: [["id", "DESC"]]
    });
    return likedUsers;
}

export const createPost = async (userId: number, dto:CreatePostDTO) =>{
    // TODO : 유저 게시글의 카테고리 정규화해서 테이블에 넣기
    // TODO : 게시글 제목, 내용, 사진 검토
    // TODO : 내용 정규식 이용해서 게시글 카테고리 분류
    // TODO : 사진 관련 처리
    // if(await Users.findByPk(userId)){throw new Error("not exist user")}; // TODO : 이거 추후 리팩토링
    // return await Posts.findOrCreate({where: {id:userId}});
    const user = await Users.findByPk(userId);
    if (!user) throw new Error("USER_NOT_FOUND");
    
    // 게시글의 제목, 내용, 사진 클린 검토 

    // 유저 게시글 제목, 내용 정규화 해서 카테고리 정리

    // 카테고리, 댓글 수, 하트수, 이미지의 적합도 (인물 혹은 이미지가 많으면 굿.) 등으로 파라미터 알고리즘 값 주기 (높을수록 노출도)

    // 이미지 

    const imageUrls = dto.image_url;

    
    const newPost = await Posts.create({
        user_id: userId,
        title: dto.title,
        content: dto.content,
        // image_url: dto.image_url,
    })
    return newPost;
}

export const getPostOne = async (postId: number) =>{
    return await Posts.findByPk(postId, {
        include:[
            {
                model: Users,
                as: "likedUsers",
                attributes: ["id"],
                through: {attributes: []}
            }
        ]
    })
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

export const getPostAll = async (cursor?: number, limit: number = 10) => {
    const where = cursor ? {id: {[Op.lt]: cursor}} : {};
    const posts = await Posts.findAll({
        where, order: [["id", "DESC"]], limit   // TODO : 노출 파라미터를 통한 정렬
    });
    return posts;
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


    
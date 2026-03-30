import Posts from "../models/posts.ts";
import Users from "../models/users.ts";

import {Op} from "sequelize";

export const create = async (userId: number) =>{
    // TODO : 유저 게시글의 카테고리 확인
    return await Posts.findOrCreate({where: {id:userId}});
}

export const getPostOne = async (postId: number, userId: number) =>{
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
}

export const getPostAll = async (cursor?: number, limit: number = 10) => {
    const where = cursor ? {id: {[Op.lt]: cursor}} : {};
    const posts = await Posts.findAll({
        where, order: [["id", "DESC"]], limit
    });
    return posts;
}


export const getUserPostLikes = async(userId: number) =>{
    return await Users.findByPk(userId, {
        include: [Posts]
    })
}

export const deletePost = async (postId: number, userId: number){
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
    
import Posts from "../models/posts.ts";
import Users from "../models/users.ts";

import {Op} from "sequelize";

interface UpdatePostDto {
  postId: number;
  userId: number;
  title: string;
  content: string;
}

export const createPost = async (userId: number) =>{
    // TODO : 유저 게시글의 카테고리 정규화해서 테이블에 넣기
    if(await Users.findByPk(userId)){throw new Error("not exist user")};
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
    
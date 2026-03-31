import { Transaction } from "sequelize";
import Images from "../models/images.ts";

export const createImages = async (
    imageUrls:string[], 
    targetId:number, 
    userId:number, 
    transaction:Transaction
) => {
    const ImagesData = imageUrls.map((url, i)=>({
        // id:postId,
        user_id: userId,
        target_id: targetId,
        image_url: url,
        image_index: i,
    }));
    return await Images.bulkCreate(ImagesData, {transaction});
}

export const getPostOneImages = async (postId:number, t:Transaction) =>{
    return await Images.findAll(
        {
            where: {post_id:postId}, 
            transaction:t
        }
    );
}

export const getPostsImages = async (postIds: number[], t:Transaction) =>{
    return postIds.map(async e => {
        await Images.findAll({where:{post_id: e}, transaction:t});
    });
}
import { Transaction } from "sequelize";
import Images from "../models/images.ts";
import { TargetType } from "../models/images.ts";

export const createImages = async (
    image_url:string[], 
    targetId:number,  // postId
    userId:number, 
    t:Transaction
) => {
    if(image_url.length===0 || !image_url) return;
    
    const ImagesData = image_url.map((url, i)=>({
        // id:postId,
        user_id: userId,
        target_id: targetId,
        image_url: url,
        image_index: i,
    }));
    return await Images.bulkCreate(ImagesData, {transaction: t});
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
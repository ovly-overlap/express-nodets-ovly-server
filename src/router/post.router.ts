import express from "express";
import * as postController from "../controllers/post.controller.ts";
import {body} from "express-validator";

const router = express.Router();
const prefix = "/posts";


// TODO : 수정, 삭제, 신고, 사진 확대해서 보기
// userController : 유저 차단
router.get(prefix, postController.getPostAll);
router.get(`${prefix}/:postId`, postController.getPostOne);
router.post(prefix, postController.createPost);
router.delete(`${prefix}/:postId`, postController.deletePost)

export default router;
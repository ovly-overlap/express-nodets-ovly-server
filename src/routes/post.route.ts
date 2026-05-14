import express, {NextFunction, Request, Response} from "express";
import * as postController from "../controllers/post.controller.ts";
import {body} from "express-validator";

const router = express.Router();
const prefix = "/posts";

router.use((err:Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    message: err.message
  });
  next();
});

// TODO : DTO 하셈 오류 디비져 
// TODO : 수정, 삭제, 신고, 사진 확대해서 보기
// userController : 유저 차단
router.get("/", postController.getPostAll);
router.post("/", postController.createPost);
router.get('/:postId', postController.getPostOne);
router.post('/:postId', postController.toggleLikePost);
router.patch('/:postId',postController.updatePost);
router.delete('/:postId', postController.deletePost);

export default router;
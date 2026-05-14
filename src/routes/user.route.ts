import express from "express";
import * as userController from "../controllers/user.controller.ts";
import {body} from "express-validator";

const router = express.Router();

// router.get('/users', authMiddleware, userController.getUsers)  미들웨어를 통해 특정 api 보호
router.get("/users", [
    body('id').isInt(),
    body('name').isString(),
], userController.getUser);

// export 해야함 님
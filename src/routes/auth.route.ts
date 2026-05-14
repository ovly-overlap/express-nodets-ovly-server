import express from "express";
import {authController} from "@/controllers/auth.controller.ts";
// import {auth} from "../middleware/auth.middleware.js";
import validate from "@/middleware/validate.js";

// const express = require('express');
// const validate = require('../../middlewares/validate');
// const authValidation = require('../../validations/auth.validation');
// const authController = require('../../controllers/auth.controller');
// const auth = require('../../middlewares/auth');

const authRouter = express.Router();

// authRouter.get('/auth', auth, (req, res) => {
//     //여기까지 미들웨어를 통과했다는 얘기는 aus가 통과.
//     res.status(200).json({
//       _id : req.user._id,
//       isAuth : true,
//       email : req.user.email,
//       name : req.user.name,
//       group : req.user.group, 
//       image : req.user.image
//     });
//   });

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.post('/refresh-token', authController.refreshAccessToken);
authRouter.post('/logout', authController.logout);
// authRouter.get("/auth/logout", authController.logout); // 토큰 확인, etc
// authRouter.post('/logout', validate(authValidation.logout), authController.logout);

// authRouter.post('/forgot-password', validate(authValidation.forgotPassword), authContr                                            o                   ller.forgotPassword);
// authRouter.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);


export default authRouter;
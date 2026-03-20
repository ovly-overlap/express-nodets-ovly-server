import express from "express";
import * as authController from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/auth/register", authController.register);
router.get("/auth/login", authController.login);
// router.get("/auth/logout", authController.logout);

export default router;
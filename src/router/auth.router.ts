import express from "express";
import authController from "../controllers/auth.controller.ts";
import 

const router = express() as const;



router.post("/auth", authController.authCurrent);
router.post("/auth/register", authController.authRegister);
router.get("/auth/login", authController.authLogin);
router.get("/auth/logout", authController.authLogout);

// export
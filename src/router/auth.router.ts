import express, { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        role: number;
        email: string;
        name: string;
        lastname: string;
        image: string;
      };
    }
  }
}
import * as authController from "../controllers/auth.controller.js";
import {auth} from "../middleware/auth.middleware.js";


const router = express.Router();

router.get('/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과했다는 얘기는 aus가 통과.
    res.status(200).json({
      _id : req.user._id,
      isAuth : true,
      email : req.user.email,
      name : req.user.name,
      role : req.user.group, 
      image : req.user.image
    });
  
  });
router.post("/auth/register", authController.register);
router.get("/auth/login", authController.login);
// router.get("/auth/logout", authController.logout);

export default router;
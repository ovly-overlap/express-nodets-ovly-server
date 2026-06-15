import express from "express";
import UserController from "@/controllers/user.controller.js";
// import { requireAuth, requireRole } from "@/middleware/authMiddleware";

const userRouter = express.Router();

// router.get('/users', authMiddleware, userController.getUsers)  미들웨어를 통해 특정 api 보호
// router.get("/users", [
//     body('id').isInt(),
//     body('name').isString(),
// ], userController.getUser);

// TODO: AuthMiddleWare 개발
// router.use(requireAuth);

// userRouter.get("/", UserController.getAll);

userRouter.get(
  "/:username",
  // cache({ duration: 60 }), // Cache for 1 minute
  UserController.getUserByName()
);

userRouter.post(
  "/",
  // validateRequest(createUserSchema),
  UserController.create
);

userRouter.patch(
  "/:id",
  // validateRequest(updateUserSchema),
  UserController.update
);

userRouter.delete("/:id", userController.delete);

export default userRouter;

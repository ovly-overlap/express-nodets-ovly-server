import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import sequelize from "@/models/index.js";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
// import { errorConverter, errorHandler } from "@/middleware/error.js";
import rateLimiter from "@/middleware/rateLimiter.js";

const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ DB Connected!");
  })
  .catch((err: Error) => {
    console.error(err);
  });

dotenv.config();

// app.use((req, res, next) => { // TODO : 라ㅜ터 리팩토링 (테스트용임)
//   console.log('app.ts 요청 들어옴');
//   next();
// });
// error handler

interface ErrorType {
  message: string;
  status: number;
}

app.use((err: ErrorType, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.use(rateLimiter);
app.use(cookieParser());
app.use(express.json());
// app.use(cors());
// app.use(authMiddleware); // 전체 인증

app.use("/auth", authRouter);
app.use("/users", userRouter);

// TODO : error Handler 나중에 발전
// // app.use(errorConverter)
// app.use(errorHandler);

//
// app.get("/", (_: Request, res: Response) => {
//   res.send("Hello World")
// })

app
  .listen(process.env.PORT, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });

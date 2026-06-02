import express from "express";
import cookieParser from "cookie-parser";
import sequelize from "@/models/index.js";
import dotenv from "dotenv"; 

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import {errorConverter, errorHandler} from "@/middleware/error.js";
import rateLimiter from "@/middleware/rateLimiter.js";

const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('✅ DB Connected!');
  })
  .catch((err: Error) => {
    console.error(err);
  });

dotenv.config();

// app.use((req, res, next) => { // TODO : 라ㅜ터 리팩토링 (테스트용임)
//   console.log('app.ts 요청 들어옴');
//   next();
// });
app.use(rateLimiter);
app.use(cookieParser());
app.use(express.json());
// app.use(cors());
// app.use(authMiddleware); // 전체 인증

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use(errorConverter)
app.use(errorHandler);

//
// app.get("/", (_: Request, res: Response) => {
//   res.send("Hello World")
// })

// TODO : port 변경
app.listen(process.env.PORT, () => {
  console.log("server running")
})

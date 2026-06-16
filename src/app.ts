import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import sequelize from "@/infrastructure/models/index.js";
import dotenv from "dotenv";

// import { errorConverter, errorHandler } from "@/middleware/error.js";
import rateLimiter from "@/infrastructure/middleware/rateLimiter.js";

import { NewsSyncJob } from "./domain/news/news-sync.job.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };
import { startNewsCron } from "./domain/news/news.cron.js";

const newsSyncJob = new NewsSyncJob();

const app = express();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

// TODO : error Handler 나중에 발전
// // app.use(errorConverter)
// app.use(errorHandler);

//
// app.get("/", (_: Request, res: Response) => {
//   res.send("Hello World")
// })

startNewsCron();

app
  .listen(process.env.PORT, async () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
    await newsSyncJob.execute();
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });

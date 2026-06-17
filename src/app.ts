import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import sequelize from "@/infrastructure/models/index.js";
import rateLimiter from "@/infrastructure/middleware/rateLimiter.js";
import { NewsSyncJob } from "./domain/news/news-sync.job.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./tsoa/swagger.json" with { type: "json" };
import { startNewsCron } from "./domain/news/news.cron.js";
import { RegisterRoutes } from "./tsoa/routes.js";
import cors from "cors";
import { ValidateError } from "@tsoa/runtime";

// 1. 데이터베이스 연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ DB Connected!");
  })
  .catch((err: Error) => {
    console.error(err);
  });

const app = express();
const newsSyncJob = new NewsSyncJob();

// 2. 글로벌 미들웨어 설정 (🚨 순서 극도로 중요!)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// TSOA가 라우팅을 하기 전에 반드시 JSON 파서와 쿠키 파서가 먼저 작동해야 합니다!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

// 3. TSOA 라우터 및 Swagger 등록
RegisterRoutes(app);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 4. 크론탭 시작
startNewsCron();

// 5. 에러 핸들링 미들웨어 (맨 아래 유지)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidateError) {
    console.error(`Caught Validation Error for ${req.path}:`, JSON.stringify(err.fields));
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  // 기타 서버 에러 처리 (필요시 추가)
  console.error("Internal Server Error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
});

// 6. 서버 가동
app
  .listen(process.env.PORT, async () => {
    console.log(`
    ################################################
        🛡️  Server listening on port ${process.env.PORT} 🛡️
    ################################################
  `);
    await newsSyncJob.execute();
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
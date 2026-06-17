import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import sequelize from "@/infrastructure/models/index.js";

import rateLimiter from "@/infrastructure/middleware/rateLimiter.js";

import { NewsSyncJob } from "./domain/news/news-sync.job.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./tsoa/swagger.json" with {type: "json"};
import { startNewsCron } from "./domain/news/news.cron.js";
import { RegisterRoutes } from "./tsoa/routes.js";
import cors from "cors";

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
app.use(
  cors({
    origin: true, 
    credentials: true,
  })
);
RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

interface ErrorType {
  message: string;
  status: number;
}

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

// TODO : error Handler 나중에 발전
// // app.use(errorConverter)
// app.use(errorHandler);

//
// app.get("/", (_: Request, res: Response) => {
  //   res.send("Hello World")
  // })
  console.log(process.env.SUPABASE_URL);

  startNewsCron();
  
  app.use((err: ErrorType, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "production" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  
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

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

app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

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

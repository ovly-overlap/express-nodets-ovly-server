// infrastructure/cron/news.cron.ts

import cron from "node-cron";
import { NewsSyncJob } from "./news-sync.job.js";

const newsSyncJob = new NewsSyncJob();

export function startNewsCron() {
  cron.schedule("0 */30 * * * *", async () => {
    console.log("뉴스 수집 시작");

    try {
      await newsSyncJob.execute();
    } catch (error) {
      console.error(error);
    }
  });
}

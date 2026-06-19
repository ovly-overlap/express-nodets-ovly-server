import cron from "node-cron";
import { NewsSyncJob } from "./news-sync.job.js";

const newsSyncJob = new NewsSyncJob();
const isVerboseNewsLog = process.env.NEWS_SYNC_VERBOSE === "true";

export function startNewsCron() {
  cron.schedule("0 */30 * * * *", async () => {
    if (isVerboseNewsLog) {
      console.log("News sync started");
    }

    try {
      await newsSyncJob.execute();
    } catch (error) {
      if (isVerboseNewsLog) {
        console.error(error);
      } else {
        console.error(
          "News sync failed:",
          error instanceof Error ? error.message : error
        );
      }
    }
  });
}

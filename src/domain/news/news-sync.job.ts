// application/jobs/news-sync.job.ts

import { EntertainmentRssProvider } from "@/infrastructure/rss/entertainment-rss.provider";

import { NewsRepository } from "@/domains/news/news.repository";

export class NewsSyncJob {
  constructor(
    private rssProvider = new EntertainmentRssProvider(),

    private newsRepository = new NewsRepository()
  ) {}

  async execute() {
    console.log("뉴스 수집 시작");

    const articles = await this.rssProvider.fetchNews();

    await this.newsRepository.bulkCreate(articles);

    console.log(`${articles.length}개 처리 완료`);
  }
}

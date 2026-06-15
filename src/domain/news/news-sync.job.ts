// application/jobs/news-sync.job.ts

import axios from "axios";

import Parser from "rss-parser";
import News from "@/infrastructure/models/news.js";
import * as cheerio from "cheerio";

const parser = new Parser();
const RSS_URL = "https://www.newsis.com/RSS/entertain.xml";

export class NewsSyncJob {
  async execute() {
    const feed = await parser.parseURL(RSS_URL);

    const newsList = [];

    for (const item of feed.items) {
      const imageUrl = await this.extractImage(item.link!);

      newsList.push({
        title: item.title,
        url: item.link,
        image_url: imageUrl,
        content: item.contentSnippet ?? "",
      });
    }

    await News.bulkCreate(newsList, {
      ignoreDuplicates: true,
    });
  }

  private async extractImage(url: string) {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    return $('meta[property="og:image"]').attr("content") ?? "";
  }
}

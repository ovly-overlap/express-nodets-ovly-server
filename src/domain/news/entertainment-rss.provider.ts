// infrastructure/rss/entertainment-rss.provider.ts

import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser();

export class EntertainmentRssProvider {
  async fetchNews() {
    const feed = await parser.parseURL("RSS_URL");

    return feed.items.map((item) => ({
      title: item.title,
      url: item.link,
      publishedAt: item.pubDate,
    }));
  }
}

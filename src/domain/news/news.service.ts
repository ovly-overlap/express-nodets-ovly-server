// import News from "@/infrastructure/models/news.js"
import News from "../../infrastructure/models/news.js";

export class NewsService {
  async getRecentNews(limit = 4) {
    const news = await News.findAll({
      order: [["createdAt", "DESC"]],
      limit: limit,
    });
    return news;
  }
}

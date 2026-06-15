import News from "@/infrastructure/models/news.js";
import { Op } from "sequelize";
// import News from "../../infrastructure/models/news.js";

export class NewsService {
  async getRecentNews(limit = 4) {
    const news = await News.findAll({
      order: [["createdAt", "DESC"]],
      limit: limit,
    });
    return news;
  }

  async searchNews(keyword: string) {
    const news = await News.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });
    return news;
  }
}

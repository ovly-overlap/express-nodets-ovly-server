// domains/news/news.repository.ts

import News from "@/infrastructure/models/news.js";
import { Op } from "sequelize";

export class NewsRepository {
  async bulkCreate(newsList: any[]) {
    await News.bulkCreate(newsList, {
      ignoreDuplicates: true,
    });
  }

  async search(keyword: string) {
    return News.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });
  }
}

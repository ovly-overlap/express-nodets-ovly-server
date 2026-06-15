import UserCase from "@/infrastructure/types/UseCase.js";
import { NewsPreview } from "./get-home.usercase.js";
import { NewsService } from "@/domain/news/news.service.js";
import { plainToInstance } from "class-transformer";

export default class GetHomeUserCase implements UserCase<null, NewsPreview> {
  constructor(private readonly newsService: NewsService) {}

  async execute(_: null) {
    return plainToInstance(NewsPreview, this.newsService.getRecentNews(3));
  }
}

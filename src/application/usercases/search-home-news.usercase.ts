import UserCase from "@/infrastructure/types/UserCase.js";
import { NewsPreview } from "./get-home.usercase.js";
import { NewsService } from "@/domain/news/news.service.js";
import { plainToClass, plainToInstance } from "class-transformer";

export default class SearchHomeNewsUserCase
  implements UserCase<string, NewsPreview>
{
  constructor(private readonly newsService: NewsService) {}

  async execute(keyword: string) {
    return plainToInstance(NewsPreview, this.newsService.searchNews(keyword));
  }
}

import UseCase from "@/infrastructure/types/UseCase.js";
import { NewsPreview } from "./get-home.usercase.js";
import { NewsService } from "@/domain/news/news.service.js";

export default class SearchHomeNewsUserCase
  implements UseCase<string, NewsPreview[]>
{
  constructor(private readonly newsService: NewsService) {}

  async execute(keyword: string) {
    const searchedNews = await this.newsService.searchNews(keyword);
    return searchedNews.map((news: NewsPreview) => ({
      id: news.id,
      title: news.title,
      image_url: news.image_url,
      url: news.url,
      content: news.content,
    }));
  }
}

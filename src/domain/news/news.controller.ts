import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { NewsService } from "./news.service.js";
import { Get, Route, Request, Controller, Query } from "@tsoa/runtime";

@Route("news")
export class NewsController extends Controller {
  private readonly newsService = new NewsService();

  @Get()
  async getRecentNews(@Request() req: ExpressRequest) {
    try {
      const limit = Number(req.query.limit) || 4;

      const news = await this.newsService.getRecentNews(limit);

      this.setStatus(200);
      return {
        items: news,
      };
    } catch (error) {
      console.error(error);

      this.setStatus(500);
      return {
        message: "INTERNAL_SERVER_ERROR",
      };
    }
  }

  @Get("search")
  async searchNews(@Request() req: ExpressRequest, @Query() keyword: string) {
    try {
      if (!keyword.trim()) {
        this.setStatus(400);
        return {
          message: "KEYWORD_REQUIRED",
        };
      }

      const news = await this.newsService.searchNews(keyword.trim());

      this.setStatus(200);
      return {
        items: news,
      };
    } catch (error) {
      console.error(error);
      this.setStatus(500);

      return {
        message: "INTERNAL_SERVER_ERROR",
      };
    }
  }
}

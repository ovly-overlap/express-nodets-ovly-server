import { NewsService } from "@/domain/news/news.service.js";
import { ScheduleService } from "@/domain/schedule/schedule.service.js";
import UserCase from "@/infrastructure/types/UseCase.js";
import { plainToInstance } from "class-transformer";

export default class GetHomeUserCase implements UserCase<number, HomeResponse> {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly newsService: NewsService
  ) {}

  async execute(userId: number): Promise<HomeResponse> {
    const userWeeklySchedule = plainToInstance(
      SchedulePreview,
      await this.scheduleService.findWeeklyById(userId)
    );
    const recentNews = plainToInstance(
      NewsPreview,
      await this.newsService.getRecentNews()
    );
    // const missions = await Mission.findAll();
    return {
      schedules: userWeeklySchedule,
      news: recentNews,
    };
  }
}

export class HomeResponse {
  schedules: SchedulePreview[] = [];

  // missions: MissionPreview[] = [];

  news: NewsPreview[] = [];
}

export class SchedulePreview {
  id!: number;
  title!: string;
  date!: string;
  memo!: string;
}

// export class MissionPreview {
//   id!: number;
//   title!: string;
//   completed: boolean = false;
// }

export class NewsPreview {
  id!: number;
  title!: string;
  url!: string;
  image_url!: string;
  content!: string;
}

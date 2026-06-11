import { NewsService } from "@/domain/news/news.service.js";
import { ScheduleService } from "@/domain/schedule/schedule.service.js";
import UserCase from "@/infrastructure/types/UserCase.js";
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
      greeting: { intro: "안녕하세요!" },
      schedules: userWeeklySchedule,
      missions: [
        {
          id: 1,
          title: "a미션 테스트",
          completed: false,
        },
      ],
      news: recentNews,
    };
  }
}

export class HomeResponse {
  greeting: GreetingInfo;

  schedules: SchedulePreview[];

  missions: MissionPreview[];

  news: NewsPreview[];
}

export class GreetingInfo {
  intro: string;
}

export class SchedulePreview {
  id: number;

  title: string;

  date: string;

  memo: string;
}

export class MissionPreview {
  id: number;

  title: string;

  completed: boolean;
}

export class NewsPreview {
  id: number;

  title: string;

  thumbnail: string;

  source: string;

  url: string;
}

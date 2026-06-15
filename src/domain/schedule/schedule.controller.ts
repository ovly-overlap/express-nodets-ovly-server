import {
  Controller,
  Post,
  Route,
  Security,
  Tags,
  Request,
  Get,
  Query,
} from "tsoa";
import { ScheduleService } from "./schedule.service.js";
import { Request as ExpressRequest } from "express";

@Route("schedule")
@Tags("schedule")
@Security("jwt")
export class ScheduleController extends Controller {
  constructor(private readonly scheduleService: ScheduleService) {
    super();
  }

  @Post()
  async createSchedule(@Request() req: ExpressRequest) {
    const userId = req.user!.id;

    const dto = {
      userId,
      title: req.body.title,
      content: req.body.content,
      memo: req.body.memo ?? "",
    };

    const schedule = await this.scheduleService.createSchedule(dto);
    return schedule;
  }

  //TODO : 스케줄 수정 로직

  @Get()
  async getScheduleByDate(
    @Request() req: ExpressRequest,
    @Query() targetDate: string // ISO string
  ) {
    const schedule = await this.scheduleService.getScheduleByDate(
      req.user.id,
      targetDate
    );
    return schedule;
  } //TODO : 특정 날자에 대한 스케줄 요청
}

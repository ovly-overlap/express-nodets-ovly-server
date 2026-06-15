import {
  Controller,
  Post,
  Route,
  Security,
  Tags,
  Request,
  Get,
  Query,
  Put,
  Path,
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

  @Put("{scheduleId}")
  async updateSchedule(
    @Request() req: ExpressRequest,
    @Path() scheduleId: number
  ) {
    return await this.scheduleService.updateSchedule(scheduleId, req.user.id, {
      title: req.body.title,
      content: req.body.content,
      memo: req.body.memo,
    });
  }

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
  }

  @Get("month")
  async getMonthSchedules(
    @Request() req: ExpressRequest,
    @Query() year: number,
    @Query() month: number
  ) {
    return await this.scheduleService.getMonthSchedules(
      req.user.id,
      year,
      month
    );
  }
}

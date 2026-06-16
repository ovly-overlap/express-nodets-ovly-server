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
} from "@tsoa/runtime";
import { ScheduleService } from "./schedule.service.js";
import { Request as ExpressRequest } from "express";
import { ScheduleResponse } from "./dto/schedule-response.dto.js";

@Route("schedule")
@Tags("schedule")
@Security("jwt")
export class ScheduleController extends Controller {
  private readonly scheduleService = new ScheduleService();

  @Post()
  async createSchedule(
    @Request() req: ExpressRequest
  ): Promise<ScheduleResponse> {
    const userId = req.user!.id;

    const dto = {
      userId,
      title: req.body.title,
      content: req.body.content,
      memo: req.body.memo,
    };

    const schedule = await this.scheduleService.createSchedule(dto);
    return schedule; // TODO : 여기부터 고치렴
  }

  @Put("{scheduleId}")
  async updateSchedule(
    @Request() req: ExpressRequest,
    @Path() scheduleId: number
  ): Promise<ScheduleResponse> {
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
  ): Promise<ScheduleResponse[]> {
    const schedule = await this.scheduleService.getScheduleByDate(
      req.user.id,
      targetDate
    );
    return schedule;
  }

  // @Get("month")
  // async getMonthSchedules(
  //   @Request() req: ExpressRequest,
  //   @Query() year: number,
  //   @Query() month: number
  // ) {
  //   return await this.scheduleService.getMonthSchedules(
  //     req.user.id,
  //     year,
  //     month
  //   );
  // }
}

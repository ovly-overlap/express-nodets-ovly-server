import Schedule from "@/infrastructure/models/schedule.js";
import { col, fn, literal, Op } from "sequelize";

export class ScheduleService {
  constructor() {}

  public async findWeeklyById(userId: number) {
    const targetDate = new Date();
    const startOfWeek = new Date(targetDate);
    const endOfWeek = new Date(targetDate);

    const day = targetDate.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    startOfWeek.setDate(targetDate.getDate() + diffToMonday);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const scheduleWeekly = await Schedule.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.between]: [startOfWeek, endOfWeek],
        },
      },
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]],
    });

    return scheduleWeekly;
  }

  async findProfilePreview(userId: number, targetDate: string) {
    const start = new Date(`${targetDate}T00:00:00.000+09:00`);
    const end = new Date(`${targetDate}T23:59:59.999+09:00`);

    return Schedule.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
    });
  }

  async createSchedule(dto: any) {
    const schedule = await Schedule.create(dto);
    return schedule;
  }

  async getScheduleByDate(userId: number, targetDate: string) {
    const start = new Date(`${targetDate}T00:00:00.000+09:00`);
    const end = new Date(`${targetDate}T23:59:59.999+09:00`);

    return await Schedule.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
    });
  }

  async updateSchedule(
    scheduleId: number,
    userId: number,
    dto: {
      title?: string;
      content?: string;
      memo?: string;
    }
  ) {
    const schedule = await Schedule.findOne({
      where: {
        id: scheduleId,
        user_id: userId,
      },
    });

    if (!schedule) {
      throw new Error("SCHEDULE_NOT_FOUND");
    }

    await schedule.update(dto);

    return schedule;
  }

  async getMonthSchedules(userId: number, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    return Schedule.findAll({
      where: {
        user_id: userId,
        createdAt: {
          [Op.between]: [start, end],
        },
      },
    });
  }
}

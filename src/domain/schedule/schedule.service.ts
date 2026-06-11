import Schedule from "@/infrastructure/models/schedule.js";
import { col, fn, literal, Op } from "sequelize";
import { CreatedAt } from "sequelize-typescript";
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

  public async findMonthlyById(userId: number) {}
}

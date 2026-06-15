//: 유저가 기존에 좋다고 한 팬덤

import { UsersService } from "@/domain/users/users.service.js";
import UseCase from "@/infrastructure/types/UseCase.js";
import { plainToInstance } from "class-transformer";

export default class SearchProfileFandomUseCase
  implements UseCase<number, UserFandomsPreview[] | null>
{
  constructor(private readonly usersService: UsersService) {}
  async execute(userId: number): Promise<UserFandomsPreview[]> {
    const fandoms = await this.usersService.findFandomByUserId(userId);
    return plainToInstance(UserFandomsPreview, fandoms);
  }
}

export class UserFandomsPreview {
  id: number;
  image_url: string;
  name: string;
}

import { UsersService } from "@/domain/users/users.service.js";
import UseCase from "@/infrastructure/types/UseCase.js";

export default class SearchProfileFandomUseCase
  implements UseCase<SearchProfileFandomRequset, UserFandomsPreview[] | null>
{
  constructor(private readonly usersService: UsersService) {}
  async execute(
    req: SearchProfileFandomRequset
  ): Promise<UserFandomsPreview[]> {
    const fandoms = await this.usersService.findFandomByKeyword(
      req.userId,
      req.keyword
    );
    return fandoms.map((item) => ({
      id: item.id,
      image_url: item.image_url,
      name: item.name,
    }));
  }
}

export class SearchProfileFandomRequset {
  userId!: number;
  keyword!: string;
}

export class UserFandomsPreview {
  id!: number;
  image_url!: string;
  name!: string;
}

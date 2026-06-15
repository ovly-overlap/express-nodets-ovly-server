import { UsersService } from "@/domain/users/users.service.js";
import { OvlySearchUsers } from "@/infrastructure/mapper.js";
import CursorResponse from "@/infrastructure/types/cursorResponse.js";
import UseCase from "@/infrastructure/types/UseCase.js";

export default class GetOvlySearchUseCase
  implements UseCase<string, CursorResponse<FriendResultPreview>>
{
  constructor(private readonly usersService: UsersService) {}

  async execute(keyword: string): Promise<CursorResponse<FriendResultPreview>> {
    const result = await this.usersService.searchUsersByName(keyword);
    return {
      items: result.items.map(OvlySearchUsers.toResponse),
      nextCursor: result.nextCursor,
      hasNext: result.hasNext,
    };
  }
}

export class FriendResultPreview {
  userId: number;
  username: string;
  profileImageUrl: string;
}

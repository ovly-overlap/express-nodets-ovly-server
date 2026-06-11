import { UsersService } from "@/domain/users/users.service.js";

export default class GetFollowUserCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly followService: FollowService
  ) {}

  async execute(userId: number) {}
}

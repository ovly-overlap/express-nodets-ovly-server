import { UserService } from "@/domain/users/users.service.js";

// TODO : 유저 차단되었는지 확인하는 칼럼
export default class GetProfileUserCase {
  constructor(
    private readonly userService: UserService,
    private readonly followService: followService
  ) {}
  async getMyProfle(userId: number) {}
  async getProfile(username: string) {}
}

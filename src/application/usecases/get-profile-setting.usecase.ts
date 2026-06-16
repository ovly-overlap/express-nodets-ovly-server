import { UsersService } from "@/domain/users/users.service.js";
import UseCase from "@/infrastructure/types/UseCase.js";

export default class GetProfileSettingUserCase
  implements UseCase<number, ProfileSettingPreview>
{
  constructor(private readonly usersService: UsersService) {}

  async execute(userId: number): Promise<ProfileSettingPreview> {
    const userInfo = await this.usersService.getUserById(userId);
    return {
      username: userInfo.username,
      intro: userInfo.intro,
      profileImageUrl: userInfo.profile_image_url,
    };
  }
}

class ProfileSettingPreview {
  username: string | undefined; // 이게 유저 아이디임
  intro!: string | null;
  profileImageUrl!: string | null;
}

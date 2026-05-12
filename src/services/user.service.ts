import sequelize from "@/models/index.ts";
import * as userRepository from "../repository/user.repository.ts";
import User from "@/models/users.ts";

export class UserService{
  constructor(private userRepository: UserRepository){}

  async getAllUsers(page=1, limit=10){
    const skip = (page-1)*limit;
    return await userRepository.findAllUsers();
  }

  async getUserById(id: string){
    const user = await sequelize.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

/**
 * 
 * const liked = await UserPostLikes.findOne({
  where: {
    user_id,
    post_id
  },
  attributes: ['user_id'] // 최소 데이터만
});

const isLiked = !!liked;

--

const count = await UserPostLikes.count({
  where: { user_id, post_id }
});

const isLiked = count > 0;
 */
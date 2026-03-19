// repositories/user.repository.ts
import { User } from '../models/user.model'
// 시퀄라이즈 모델에 접근

export const findAllUsers = async () => {
  return await User.findAll()
}

export const findUserById = async (id: number) => {
  return await User.findByPk(id)
}

export const findByEmail = (email: string) => {
  return User.findOne({ where: { email } })
}


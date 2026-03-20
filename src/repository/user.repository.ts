import User from "../models/user.js";

export const findAllUsers = async () => {
  return await User.findAll()
}

export const findUserById = async (id: number) => {
  return await User.findByPk(id)
}

export const findByEmail = (email: string) => {
  return User.findOne({ where: { email } });
}

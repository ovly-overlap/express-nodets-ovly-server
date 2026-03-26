import User from "../models/users.ts";

// TODO : 인증 인가 기능
// TODO : 쿠키 반환

export const findAllUsers = async () => {
  return await User.findAll()
}

export const findUserById = async (id: number) => {
  return await User.findByPk(id)
}

export const findByEmail = (email: string) => {
  return User.findOne({ where: { email } })
}

// ! user 생성 로직 오류 가능성
export const createUser = ({password, ...data}) => User.create(data, password);

// export const findByToken: any(token);
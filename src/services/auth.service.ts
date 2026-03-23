// services/auth.service.ts
// import * as userRepository from '../repository/user.repository.ts';
import * as authRepository from "../repository/auth.repository.js";
import { SignupRequestDTO } from '../dto/signupReq.dto.js';

import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


// TODO : (data: SignupRequestDTO) 으로 변경 후 테스트
export const register = async (data: SignupRequestDTO) => {
  const existing = await authRepository.findByEmail(data.email)
  if (existing) {
    throw new Error('이미 존재하는 유저');
  }
  const hashedPassword = await bcrypt.hash(data.password, 10)

  return await authRepository.createUser({
    password: hashedPassword,
    ...data,
  });
}

// TODO : 테스트 후 LoginReq.dto 제작 후 적용
// TODO : 토큰을 쿠키 적용
export const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  if (!user) throw new Error('유저 없음');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('비밀번호 틀림');

  // const token = generateToken({ id: user.id });
  const token = jwt.sign({});
  return { token };
}

// export const logout = async (data: any) => {
    
// }
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
  // const {userEmail, password} = req.body;
  const user = await authRepository.findByEmail(email);
  if (!user) throw new Error('존재하지 않는 사용자');

  const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) throw new Error('비밀번호 틀림');
  if(isMatch){
    const token = jwt.sign({  // 이메일, 이름, 로그인 타임
      userEmail: email,
      loginTime: new Date().toISOString()
    }, "secret", {expiresIn: '30m'});
    console.log(email, "로그인", Date.now());
    return {token};
  } 
  else{
    throw new Error("로그인오류 : 비밀번호 확인좀");
  }

}

// export const logout = async (data: any) => {
    
// }
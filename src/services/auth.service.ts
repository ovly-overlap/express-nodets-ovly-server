// services/auth.service.ts
// import * as userRepository from '../repository/user.repository.ts';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import Users from "@/models/users.ts";
import { AppError } from '@/utils/appError.ts';

// TODO : 토큰 관리 관련 로직
// TODO : 무차별 대입 가입 막는 로직 (ip)
// TODO : 토큰 쿠키 CSRF 예방 로직쓰기

export class AuthService{
  constructor(private authService: AuthService){}

  // private generateVerificationToken(): string {
  //   return crypto.randomBytes(32).toString('hex');
  // }

  async signup(username:string, password:string){
    const isUserExist = await Users.findOne({ where: {username}});
    if (isUserExist) {
      throw new AppError("존재하는 유저", 401);
    }

    return await Users.create({username, password})
  }

  async login(username:string, password:string){ // TODO : DTO 처리 << 어떻게 해야할지 모르겟네;
    const isUserExist = await Users.findOne({ where: {username}});
    if(!isUserExist) throw new AppError("존재하지 않는 유저", 400);

    const payload = {userId: user.id, username: username};
    const token = jwt.sign(payload, JWT_SECRET, { // TODO : 키 관련 추가 처리
      expiresIn: '10m', algorithm: 'HS256'
    });
    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d', algorithm: 'HS256'
    })

    const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) throw new Error('비밀번호 틀림');
    if(isMatch){
      const token = jwt.sign({  // 이메일, 이름, 로그인 타임
        userEmail: userEmail,
        loginTime: new Date().toISOString()
      }, "secret", {expiresIn: '30m'});
      console.log(userEmail, "로그인", Date.now());

    } 
    else{
      throw new Error("로그인오류 : 비밀번호 확인해주세요");
    }
    
    return { 
      accessToken: token, 
      refreshToken: refreshToken, 
      tokenExpires: new Date(Date.now() + 15 * 60 * 1000)
    };
  }

    /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  async logout(refreshToken: any){
    // const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    // if (!refreshTokenDoc) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    // }
    // await refreshTokenDoc.remove();
  };
}



// /**
//  * Refresh auth tokens
//  * @param {string} refreshToken
//  * @returns {Promise<Object>}
//  */
// export const refreshAuth = async (refreshToken) => {
//   try {
//     const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
//     const user = await userService.getUserById(refreshTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await refreshTokenDoc.remove();
//     return tokenService.generateAuthTokens(user);
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// };
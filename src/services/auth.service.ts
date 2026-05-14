// services/auth.service.ts
// import * as userRepository from '../repository/user.repository.ts';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

import Users from "@/models/users.ts";
import { AppError } from '@/utils/appError.ts';
import { AuthResponseDTO, SignInDTO, SignUpDTO, SignUpResponseDTO, UserResponseDTO } from '@/types/index.js';

// TODO : 토큰 관리 관련 로직
// TODO : 무차별 대입 가입 막는 로직 (ip)
// TODO : 토큰 쿠키 CSRF 예방 로직쓰기 (app.ts<<)
// TODO : payload에 이름 이외의 정보를 types에 만들어주기

export interface IAuthService {
  signUp(data: SignUpDTO): Promise<SignUpResponseDTO>;
  signIn(data: SignInDTO): Promise<AuthResponseDTO>;
  refreshToken(userId: string): Promise<{ accessToken: string }>;
  logout(userId: string): Promise<void>;
}

export class AuthService implements IAuthService{

  // private generateVerificationToken(): string {
  //   return crypto.randomBytes(32).toString('hex');
  // }
  private toUserResponseDTO(user: Users): UserResponseDTO{
    return{
      id: user.id.toString(),
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  async signUp(data: SignUpDTO): Promise<SignUpResponseDTO>{
    // TODO: 아이디 입력시 한국어영어일본어중국어스페인어 이외 언어 제한
    const {username, password} = data;
    const existUser = await Users.findOne({ where: {username}});
    if (existUser) {
      throw new AppError("존재하는 유저", 401);
    }

    // const hashedPassword = await bcrypt.hash(password, config.BCRYPT_SALE_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      username, password:hashedPassword
    });

    return { user: this.toUserResponseDTO(user)}
  }

  async signIn(data: SignInDTO): Promise<AuthResponseDTO>{ // TODO : DTO 처리 << 어떻게 해야할지 모르겟네;
    const {username, password} = data;
    const existUser = await Users.findOne({ where: {username}});
    if(!existUser) throw new AppError("존재하지 않는 유저", 400);

    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid credentials",
        401,

        // ErrorCode.INVALID_CREDENTIALS
      );
    }
    const JWT_SECRET = '1111'; // TODO : 시크릿키 환경파일에서 관리
    const JWT_REFRESH_SECRET = JWT_SECRET;
    const payload = {userId: existUser.id, username: username};
    const token = jwt.sign(payload, JWT_SECRET, { // TODO : 키 관련 추가 처리
      expiresIn: '10m', algorithm: 'HS256'
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '1d', algorithm: 'HS256'
    });
    // TODO : 토큰 DB 저장 로직
    await existUser.update({refreshToken: refreshToken});

    return { 
      user: this.toUserResponseDTO(existUser),
      accessToken: token, 
      refreshToken: refreshToken, 
      tokenExpires: new Date(Date.now() + 15 * 60 * 1000)
    };
  }

  async refreshToken(receiveRefreshToken: string): Promise<{accessToken: string}> {
    try{
      const decoded = jwt.verify(receiveRefreshToken, 'JWT_REFRESH_SECRET') as {userId: string}; // TODO : JWT_REFRESH_TOKEN 2 인자 추가
      const user = await Users.findByPk(decoded.userId);
      if(!user || user.refreshToken !== receiveRefreshToken){
        throw new AppError("유효하지 않은 리프레시 토큰", 401);
      };
      const newAccessToken = jwt.sign(
        {userId: user.id, username: user.username}, 'JWT_SECRET', {expiresIn: '10m'} );
      return {accessToken: newAccessToken}
    } catch(error){
      throw new AppError("인증 세션이 만료 되었습니다.", 401);
    }
  };

  async logout(userId: string): Promise<void>{
    const user = await Users.findByPk(userId);
    if(user){
      await user.update({refreshToken: null}); // DB에서 토큰을 비워서 재발급 불가 로직
    }
  }
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
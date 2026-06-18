// services/auth.service.ts
// import * as userRepository from '../repository/user.repository.ts';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Users from "@/infrastructure/models/users.js";
import { AppError } from "@/infrastructure/types/appError.js";
import { SignUpDto } from "./dto/signup.dto.js";
import { SignInDto } from "./dto/signin.dto.js";
import { ErrorCode } from "@/infrastructure/types/errorCodes.js";

import { StringValue } from "ms";

// TODO : 토큰 관리 관련 로직
// TODO : 무차별 대입 가입 막는 로직 (ip)
// TODO : 토큰 쿠키 CSRF 예방 로직쓰기 (app.ts<<)
// TODO : payload에 이름 이외의 정보를 types에 만들어주기

export class AuthService {
  // private generateVerificationToken(): string {
  //   return crypto.randomBytes(32).toString('hex');

  // }

  async signUp(data: SignUpDto): Promise<any> {
    const { username, password, passwordConfirm } = data;

    const existUser = await Users.findOne({ where: { username } });
    if (existUser) {
      throw new AppError("존재하는 유저", 409);
    }

    if (password !== passwordConfirm) {
      throw new AppError(ErrorCode.INVALID_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.create({
      username,
      password: hashedPassword,
    });

    return {
      success: true,
    };
  }

  async signIn(data: SignInDto): Promise<any> {
    const JWT_SECRET = process.env.SECRET_KEY!;
    const JWT_REFRESH_SECRET = process.env.REFRESH_SECRET_KEY!;
    const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES!;

    const { username, password } = data;
    console.log("백엔드가 받은 username:", username); // 🚨 여기에 '곽곽디라라'가 진짜 찍히는지 확인!
    const existUser = await Users.findOne({ where: { username } });

    if (!existUser) throw new AppError("존재하지 않는 유저", 400);

    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401);
    }
    const payload = { id: existUser.id, username: username };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES as StringValue,
      algorithm: "HS256",
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES as StringValue,
      algorithm: "HS256",
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await existUser.update({ refreshToken: hashedRefreshToken });

    return {
      accessToken: token,
      refreshToken: refreshToken,
      tokenExpires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES),
      user: {
        id: existUser.id,
        username: existUser.username,
      }
    };
  }

  async checkUsernameExist(username: string): Promise<boolean> {
    const user = await Users.findOne({
      where: { username },
      attributes: ["username"],
    });
    return user === null;
  }

  async refreshToken(
    receiveRefreshToken: string
  ): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(
        receiveRefreshToken,
        process.env.REFRESH_SECRET_KEY!
      ) as {
        id: string,
        username: string
      };

      const user = await Users.findByPk(decoded.id);

      const isValidRefreshToken = await bcrypt.compare(
        receiveRefreshToken,
        user?.refreshToken!
      );

      if (!user || !isValidRefreshToken) {
        throw new AppError("유효하지 않은 리프레시 토큰", 401);
      }
      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.SECRET_KEY!,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES as StringValue,
          algorithm: "HS256",
        }
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new AppError("다시 로그인 해주세요.", 401);
    }
  }

  async logout(userId: number): Promise<void> {
    const user = await Users.findByPk(userId);
    if (user) {
      await user.update({
        refreshToken: null,
      });
    }
  }
}

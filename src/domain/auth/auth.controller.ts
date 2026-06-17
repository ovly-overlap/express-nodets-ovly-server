// controllers/auth.controller.ts
import { NextFunction, Request as ExpressRequest, Response } from "express"; // Ensure Response is imported from express
import { AppError } from "@/infrastructure/types/appError.js";
import { AuthService } from "@/domain/auth/auth.service.js";
import {
  Controller,
  Example,
  Get,
  Post,
  Query,
  Route,
  Security,
  SuccessResponse,
  Tags,
  Request,
  Body,
} from "@tsoa/runtime";
import { SignInDto } from "./dto/signin.dto.js";
import { SignUpDto } from "./dto/signup.dto.js";
import { SignInResponseDto } from "./dto/signin-response.dto.js";
import { CheckIdResponse } from "./dto/signup.check-id-response.dto.js";
import { RefreshTokenResponseDto } from "./dto/refresh-token-response.dto.js";

@Route("auth")
@Tags("auth")
export class AuthController extends Controller {
  // constructor(private readonly authService: AuthService) {
  //   super();
  // }
  private readonly authService = new AuthService();

  @Get("me")
  @Security("jwt")
  async me(
    @Request() req: ExpressRequest
  ): Promise<{ id: number; username: string }> {
    return {
      id: req.user.id,
      username: req.user.name,
    };
  }

  @Post("signup")
  @SuccessResponse("201", "Created")
  @Example<SignUpDto>({
    username: "주라미",
    password: "00000000",
    passwordConfirm: "00000000",
  })
  async signUp(@Body() signUpdto: SignUpDto): Promise<void> {
    const { username, password, passwordConfirm } = signUpdto;
    console.log("BODY:", signUpdto);
    await this.authService.signUp({ username, password, passwordConfirm });
  }

  @Get("signup/check-id")
  public async checkId(@Query() username: string): Promise<CheckIdResponse> {
    const isAvaliable = await this.authService.checkUsernameExist(username);
    if (!isAvaliable) {
      this.setStatus(409);
      return { isAvaliable: false, message: "이미 사용 중인 아이디입니다." };
    }
    return { isAvaliable: true, message: "사용 가능한 아이디입니다." };
  }

  @Post("signin")
  @Example<SignInDto>({
    username: "주라미",
    password: "00000000",
  })
  async signIn(
    @Request() req: ExpressRequest,
    @Body() body: SignInDto
  ): Promise<SignInResponseDto> {
    const { username, password } = body;
    const result = await this.authService.signIn({
      username,
      password,
    });
    req.res?.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, // prod -> true
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1d
    });
    return { accessToken: result.accessToken };
  }

  @Post("refresh")
  @Example({
    refreshToken: "",
  })
  async refreshAccessToken(
    @Request() req: ExpressRequest
  ): Promise<RefreshTokenResponseDto> {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) {
      throw new AppError("refrshToken requirrrrred", 401);
    }
    const accessToken = await this.authService.refreshToken(refreshToken);
    return accessToken;
  }

  @Post("logout")
  @Security("jwt")
  async logout(@Request() req: ExpressRequest): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.authService.logout(userId);
    req.res?.clearCookie("refreshToken");
    return { message: "로그아웃 성공" };
  }
}

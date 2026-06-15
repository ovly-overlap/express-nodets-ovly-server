// controllers/auth.controller.ts
import { NextFunction, Request, Response } from "express"; // Ensure Response is imported from express
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
} from "tsoa";
import { SignUpResponseDTO } from "@/infrastructure/types/index.js";
import { SignInDto } from "./dto/auth.signin.dto.js";
import { SignInResDto } from "./dto/auth.signin-res.dto.js";
import { SignUpDto } from "./dto/auth.signup.dto.js";

interface CheckIdResponse {
  isAvaliable: boolean;
  message: string;
}

@Route("auth")
class AuthController extends Controller {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post("signup")
  @SuccessResponse("201", "Created")
  @Example<SignUpDto>({
    username: "주라미",
    password: "00000000",
    passwordConfirm: "00000000",
  })
  async signUp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<SignUpResponseDTO> {
    const { username, password } = req.body;
    return await this.authService.signUp({ username: username, password });
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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<SignInResDto> {
    // login
    const { username, password } = req.body;
    const result = await this.authService.signIn({
      username: username,
      password,
    }); // id값 필
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, // prod -> true
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
    const response: SignInResDto = {
      accessToken: result.accessToken,
    };
    return response;
  }

  @Post("refresh")
  @Example({
    refreshToken: "",
  })
  async refreshAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies.refreshToken as string | false | undefined;
    if (!refreshToken) {
      next(new AppError("refrshToken requirrrrred", 401));
      return;
    }
    const accessToken = await this.authService.refreshToken(refreshToken);
    return accessToken;
  }

  @Post("logout")
  @Security("jwt")
  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ message: string }> {
    const userId = req.user.id;
    if (!userId) {
      throw new AppError("unAuthorized", 401);
    } else {
      await this.authService.logout(userId);
    }
    res.clearCookie("refreshToken");
    return { message: "로그인 성공" };
  }
}

const authService = new AuthService();
export const authController = new AuthController(authService);

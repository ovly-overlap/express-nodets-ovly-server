// controllers/auth.controller.ts
import { NextFunction, Request, Response } from 'express'; // Ensure Response is imported from express
import { BaseController } from './base.controller.js';
import { AppError } from '@/utils/appError.js';
import { AuthService, IAuthService } from '@/services/auth.service.js';

export interface IAuthController {
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshAccessToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
}


class AuthController extends BaseController implements IAuthController {
  // constructor(private authService: AuthService){
  //   super();
  // }
  private authService: IAuthService;

  constructor(authService: IAuthService){
    super();
    this.authService = authService;
  }

  signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    await this.handleRequest(req, res, next, async () => {
      const { username, password } = req.body;
      return await this.authService.signUp({username:username, password});
    });
  }

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{ // login
    await this.handleRequest(req, res, next, async () => {
      const {name, password} = req.body;
      const result = await this.authService.signIn({username:name, password});
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: false, // prod -> true
        sameSite: 'strict',
        maxAge: 7* 24* 60* 60* 1000 // 7d
      });
      res.json({accessToken: result.accessToken});
    });
  }

  refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      // const { refreshToken } = req.body;
      const refreshToken = req.cookies.refreshToken as string | false | undefined;
      if(!refreshToken){
        next(new AppError("refrshToken requirrrrred", 401));
        return;
      }
      const accessToken = await this.authService.refreshToken(refreshToken);
      return { accessToken };
    });
  };

  
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    await this.handleRequest(req, res, next, async () =>{
      if(!req.user?.userId){ // TODO: 추후 인증 미들웨어 변경 및 반영
        throw new AppError("unAuthorized", 401);
      }
      else{
        await this.authService.logout(req.user.userId);
      }
      res.clearCookie('refreshToken');
      return {message: "로그인 성공"};
    });
  }
}

const authService = new AuthService();
export const authController = new AuthController(authService);
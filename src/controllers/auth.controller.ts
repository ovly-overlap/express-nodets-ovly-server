// controllers/auth.controller.ts
import { NextFunction, Request, Response } from 'express'; // Ensure Response is imported from express
import { BaseController } from './base.controller.ts';
import { AppError } from '@/utils/appError.ts';
import { AuthService } from '../services/auth.service.js';

export interface IAuthController {
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshAccessToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): void;
}


export class AuthController extends BaseController implements IAuthController {
  constructor(private authService: AuthService){
    super();
  }

  signup = (req: Request, res: Response, next: NextFunction): void =>{
    this.handleRequest(req, res, next, async () => {
      const { name, password } = req.body;
      return await this.authService.signUp({username:name, password});
    });
  }

  signin = (req: Request, res: Response, next: NextFunction): void =>{ // login
    this.handleRequest(req, res, next, async () => {
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

  logout = (req: Request, res: Response, next: NextFunction): void =>{
    this.handleRequest(req, res, next, async () =>{
      if(!req.user?.userId){
        throw new AppError("unAuthorized", 401);
      }
      await this.authService.logout(req.user.userId);
      return {message: "로그인 성공"};
    });
  }

  refresh = (req: Request, res: Response, next: NextFunction): void => {
    this.handleRequest(req, res, next, async () => {
      const { refreshToken } = req.body;
      return await this.authService.refresh(refreshToken);
    });
  };

  // resetPassword = (req: Request, res: Response, next: NextFunction): void => {
  //   this.handleRequest(req, res, next, async () => {
  //     const { token } = req.params;
  //     const { password } = req.body;
  //     return await this.authService.resetPassword(token, password);
  //   });
  // };
}

// // TODO : res type 확정
// export const register = async (req: Request<{}, {}, SignupRequestDTO>, res: Response) => {
//   // const user = await authService.register(req.body);
//   try {
//     const user = await authService.register(req.body);
    
//     // 상태 코드를 명시하고(201), 타입을 준수하여 응답
//     return res.status(201).json(user);
//   } catch (error) {
//     // 에러 핸들링 로직 필요
//     return res.status(500).json({ message: "Internal Server Error" });
//   }   
// }

// export const login = async (req: Request<LoginReqDTO>, res: Response) => {
//   try{
//     const token = await authService.login(req.body);
//     return res.send({...token});
//   } catch(error) {
//     // return res.json("")
//   }
// }

// // const refreshTokens = catchAsync(async (req, res) => {
// //   const tokens = await authService.refreshAuth(req.body.refreshToken);
// //   res.send({ ...tokens });
// // });
// // const catchAsync = (fn) => (req, res, next) => {
// //   Promise.resolve(fn(req, res, next)).catch((err) => next(err));
// // };
// // module.exports = catchAsync;

// export const refreshTokens = async (req, res) => {
//   const tokens = await authService.refreshAuth(req.body.refreshToken);
//   res.send({ ...tokens });
// }
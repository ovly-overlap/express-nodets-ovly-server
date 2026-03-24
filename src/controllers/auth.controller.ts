// controllers/auth.controller.ts
import { LoginReqDTO } from '../dto/login.dto.ts';
import { SignupRequestDTO } from '../dto/signupReq.dto.ts';
import * as authService from '../services/auth.service.js';
import { Request, Response } from 'express'; // Ensure Response is imported from express


// TODO : res type 확정
export const register = async (req: Request<{}, {}, SignupRequestDTO>, res: Response) => {
  // const user = await authService.register(req.body);
  try {
    const user = await authService.register(req.body);
    
    // 상태 코드를 명시하고(201), 타입을 준수하여 응답
    return res.status(201).json(user);
  } catch (error) {
    // 에러 핸들링 로직 필요
    return res.status(500).json({ message: "Internal Server Error" });
  }   
}

export const login = async (req: Request<LoginReqDTO>, res: Response) => {
  try{
    const token = await authService.login(req.body);
    return res.json(token);
  } catch(error) {
    // return res.json("")
  }
  // res.json(token);
}
// controllers/auth.controller.ts
import { LoginReq } from '../dto/loginReq.dto.ts';
import { SignupRequestDTO } from '../dto/signupReq.dto.ts';
import * as authService from '../services/auth.service.js';

// TODO : res type 확정
export const register = async (req :SignupRequestDTO, res) => {
  const user = await authService.register(req);
  res.json(user);
}

export const login = async (req: LoginReq, res: { json: (arg0: any) => void; }) => {
  try{
    const token = await authService.login({email:req.email, password:req.password});
    return res.json(token);
  } catch(error) {
    
  }
  // res.json(token);
}
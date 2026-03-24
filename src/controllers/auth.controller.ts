// controllers/auth.controller.ts
import { LoginReqDTO } from '../dto/loginReq.dto.ts';
import { LoginResDTO } from '../dto/loginRes.dto.ts';
import { SignupRequestDTO } from '../dto/signupReq.dto.ts';
import * as authService from '../services/auth.service.js';

// TODO : res type 확정
export const register = async (req :SignupRequestDTO, res) => {
  const user = await authService.register(req);
  res.json(user);
}

export const login = async (req: LoginReqDTO, res: LoginResDTO) => {
  try{
    const token = await authService.login({email:req.email, password:req.password});
    return res.json(token);
  } catch(error) {
    return res.json("")
  }
  // res.json(token);
}
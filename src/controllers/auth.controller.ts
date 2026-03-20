// controllers/auth.controller.ts
import { SignupRequestDTO } from '../dto/signupReq.dto.ts';
import * as authService from '../services/auth.service.js';

export const register = async (req :SignupRequestDTO, res) => {
  const user = await authService.register(req.body)
  res.json(user)
}

export const login = async (req: { body: any; }, res: { json: (arg0: any) => void; }) => {
  const token = await authService.login(req.body)
  res.json(token)
}
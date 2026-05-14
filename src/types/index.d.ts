// import { AuthUser } from './auth.types.js';
import { JwtPayload } from "jsonwebtoken";
import * as express from "express"; // 추후 삭제

// declare global {
//   namespace Express {
//     interface Request {
//       user?: AuthUser
//     }
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
      email: string
      password: string
    }
  }
}

export interface UserResponseDTO {
  id: string;
  // email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload { // jwt
  userId: string;
}

// Auth types
export interface SignUpDTO {
  username: string;
  password: string;
}

export interface SignInDTO {
  username: string;
  password: string;
}

// Returned by signUp — no tokens (user must sign in separately)
export interface SignUpResponseDTO {
  user: UserResponseDTO;
}

// Returned by signIn — always includes both tokens
export interface AuthResponseDTO {
  user: UserResponseDTO;
  accessToken: string;
  refreshToken: string;
  tokenExpires: Date;
}
// import { type Session } from "express";
// import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: string
      email: string
      name: string
      group: number
      image?: string
    }
  }
}
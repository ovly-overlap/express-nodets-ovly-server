import User from "../models/users.ts";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";



export const authMiddleware = (req:Request, res:Response, next:NextFunction) : void => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, "secretKey") as jwt.JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "bad request" });
    return; 
  }
}

import User from "../models/user.js";
import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";



export const authMiddleware = (req:Request, res:Response, next:NextFunction) : void => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, "secretKey");
    // req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "bad request" });
    return; 
  }
};

// 토큰 확인
export const auth = (req, res, next) => {
  let token = req.cookies.x_auth;
  // 자동으로 토큰이 디코드 확인
  User.findByToken(token, (err: any, user: any) =>{
    if (err) throw err;
    if (!user) return res.json({isAuth : false, err : true}); //유저가 없으면 인증 no.
    req.token = token;
    req.user = user;
    next();
  });
}

/**
 * 로그인 실패 
 * > 
 * 
 * 로그인 성공
 * 서버가 JWT 발급 > 쿠키에 저장 > 이후 요청에 쿠키 자동포함 > 미들웨어에서 JWT 꺼내서 검증 > 유저 인증
 * 
 */


// const { User } = require('../models/User');

// //인증 처리를 위한 곳. 
// let auth = (req, res, next) => {
//     //클라이언트 쿠키에서 토큰을 가져온다. 
//     let token = req.cookies.x_auth;

//     //토큰을 복호화한 후 유저를 찾는다.
//     User.findByToken(token, (err, user) => {
//         if (err) throw err;
//         if (!user) return res.json({isAuth : false, err : true}); //유저가 없으면 인증 no.

//         //유저가 있으면 인증 Ok
//         req.token = token; //req에 넣어주므로, 라우트에서 사용할 수 있도록함. 
//         req.user = user;
//         next(); //-> 미들웨어이므로, 다음 단계로 전진할 수 있도록함. 
//     });
// }

// module.exports = { auth };


// app.get('/api/users/auth', auth, (req, res) => {
//   //여기까지 미들웨어를 통과했다는 얘기는 aus가 통과.
//   res.status(200).json({
//     _id : req.user._id,
//     isAdmin: req.user.role === 0? false : true,
//     isAuth : true,
//     email : req.user.email,
//     name : req.user.name,
//     lastname : req.user.lastname, 
//     role : req.user.role, 
//     image : req.user.image
//   });

// });
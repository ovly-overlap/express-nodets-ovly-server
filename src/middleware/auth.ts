import { authenticate } from 'passport';
import { UNAUTHORIZED, FORBIDDEN } from 'http-status';
import * as jwt from "jwtwebtoken"; 

import {AppError} from '../utils/appError.js';


const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new AppError(UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new AppError(FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};


export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    // const decoded = jwt.verify(token, "secretKey") as jwt.JwtPayload;
    const decoded = jwt.verify(token, "secretKey");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "bad request" });
    return; 
  }
}


export default auth;
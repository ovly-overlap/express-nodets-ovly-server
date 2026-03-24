// import { AuthUser } from './auth.types.js';
import { JwtPayload } from "jsonwebtoken";

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
      email: string
      password: string
      user?: JwtPayload
    }
  }
}

export {}
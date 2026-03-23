// types/express.d.ts
import { AuthUser } from './auth.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export {}
import jwt from "jsonwebtoken";

import { Request } from "express";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const token = request.cookies.accessToken;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY!);
    return payload;
  }

  throw new Error("Unauthorized");
}

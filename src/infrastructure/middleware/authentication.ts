import jwt from "jsonwebtoken";
import { Request } from "express";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    // 1. 헤더에서 'Authorization' 값을 가져옵니다. (보통 'Bearer 토큰문자열' 형태)
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }

    // 2. 'Bearer ' 글자를 잘라내고 순수 토큰 문자열만 추출합니다.
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorized");
    }

    try {
      // 3. 토큰 검증
      const payload = jwt.verify(token, process.env.SECRET_KEY!);
      return payload;
    } catch (error) {
      // 토큰이 만료되었거나 변조된 경우 에러 처리
      throw new Error("Unauthorized");
    }
  }

  throw new Error("Unauthorized");
}
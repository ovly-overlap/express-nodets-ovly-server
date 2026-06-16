import { ErrorCode } from "./errorCodes.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

export class BadRequestError extends AppError {
  public readonly code: ErrorCode = ErrorCode.BAD_REQUEST;
  constructor(message: string, code = ErrorCode.BAD_REQUEST) {
    super(message, 400, code);
  }
}

// errors/NotFoundError.js (404)
export class NotFoundError extends AppError {
  public readonly code: ErrorCode = ErrorCode.NOT_FOUND;
  constructor(message: string, code = ErrorCode.NOT_FOUND) {
    super(message, 404, code);
  }
}

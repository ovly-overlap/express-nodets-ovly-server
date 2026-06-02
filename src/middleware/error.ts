import { NextFunction, ErrorRequestHandler } from "express";
import { ValidationError, BaseError } from "sequelize";
import httpStatus from "http-status";

import { AppError } from "../utils/appError.js";
import { error as _error } from "../config/logger.js";

const errorConverter = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ValidationError) && !(error instanceof BaseError)) {
    const statusCode =
      error.statusCode ||
      (error instanceof Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR);
    const message = error.message || httpStatus[statusCode];
    error = new AppError(statusCode, message, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    _error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };

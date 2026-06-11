import { Request, Response, NextFunction } from "express";
// import { ApiResponse } from "@/utils/apiResponse.js";
import { Controller } from "tsoa";
import { ApiResponse } from "./infrastructure/types/apiResponse.js";

// TODO : zod, validation을 활용한 컨트롤러

export abstract class BaseController extends Controller {
  protected async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    action: () => Promise<any>
  ): Promise<void> {
    try {
      const result = await action();
      ApiResponse.success(res, result);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        res.status(400).json({ message: error.errors[0].message });
        ApiResponse.error(res, "sequlizeError");
        return;
      }
      next(error);
    }
  }
  // protected async handleError(
  //   req: Request, res: Response, error:Error
  // ){
  //   res.status(400).json({message})
  // }
}

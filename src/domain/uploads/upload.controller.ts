import { Controller, Post, Route, Request } from "tsoa";
import { Request as ExpressRequest } from "express";
import UploadsService from "./upload.service.js";
import { CreateUploadUrlRequest } from "./dto/create-upload-url.request.dto.js";

@Route("users")
export default class UploadController extends Controller {
  constructor(private readonly uploadsService: UploadsService) {
    super();
  }

  @Post("/presigned-url")
  async createUploadUrl(@Request() req: ExpressRequest) {
    const body = req.body as CreateUploadUrlRequest;
    const response = await this.uploadsService.generateUploadUrl(
      req.user.id,
      body.type,
      body.fileName,
      body.contentType
    );

    this.setStatus(200);
    return response;
  }
}

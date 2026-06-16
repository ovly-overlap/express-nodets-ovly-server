import { Controller, Post, Route, Request } from "@tsoa/runtime";
import { Request as ExpressRequest } from "express";
import UploadsService from "./upload.service.js";
import { CreateUploadUrlRequest } from "./dto/create-upload-url.request.dto.js";
import { CreateUploadUrlResponse } from "./dto/create-upload-url-response.dto.js";

@Route("users")
export class UploadController extends Controller {
  private readonly uploadsService = new UploadsService();

  @Post("/presigned-url")
  async createUploadUrl(
    @Request() req: ExpressRequest
  ): Promise<CreateUploadUrlResponse> {
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

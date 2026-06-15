import { UploadType } from "../upload.service.js";

export interface CreateUploadUrlRequest {
  type: UploadType;
  fileName: string;
  contentType: string;
}

import { UploadType } from "../enum/UploadType.js";


export interface CreateUploadUrlRequest {
  type: UploadType;
  fileName: string;
  contentType: string;
}

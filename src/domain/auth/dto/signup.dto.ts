// import { MaxLength, MinLength, Pattern } from "@tsoa/runtime";

export class SignUpDto {
  // TSOA 전용 데코레이터 또는 JSDoc 태그 사용
  // @MaxLength(20)
  // @Pattern("^[가-힣a-zA-Z0-9_\\.]{2,20}$")
  username!: string;

  // @MinLength(8)
  password!: string;

  passwordConfirm!: string;
}
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @IsString({ message: "사용자 이름은 문자열입니다" })
  @IsNotEmpty({ message: "사용자 이름을 입력해주세요" })
  username!: string;

  @IsString({ message: "비밀번호는 문자열입니다" })
  @IsNotEmpty({ message: "비밀번호를 입력해주세요" })
  password!: string;
}

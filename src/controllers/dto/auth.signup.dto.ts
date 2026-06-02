import { Match } from "@/utils/match.decorator.js";
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class SignUpDto {
  @IsString({ message: "사용자 이름은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "사용자 이름은 필수입니다." })
  @MaxLength(20, { message: "사용자 이름은 최대 20자까지 가능합니다." })
  @Matches(/^[가-힣a-zA-Z0-9_\.]{2,20}$/, {
    message: '영어, 한국어, 특수문자는 "_", "."만 사용 가능해요',
  })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "비밀번호는 최소 8자 이상 입력하세요" })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: "비밀번호 확인을 입력해주세요" })
  @Match("password", { message: "비밀번호가 일치하지 않습니다" })
  passwordConfirm!: string;
}

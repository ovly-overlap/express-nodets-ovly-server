import { IsString, IsNotEmpty } from "class-validator";

export class SignInResDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}

import { IsString, IsNotEmpty } from "class-validator";

export class SignInResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}


export class SignInResponseDto {
  accessToken!: string;
  user!: {
    id: number,
    username: string;
  }
}


export class LoginReq{
    email: string;
    password: string;
    name: string;

    static of(body: any): LoginReq {
        const dto = new LoginReq();
        dto.email = body.email;
        dto.password = body.password;
        dto.name = body.name;

        // SignupRequestDTO.validation(dto);
        return dto;
    }
}

export class LoginReqDTO{
    email: string;
    password: string;
    name: string;

    static of(body: any): LoginReqDTO {
        const dto = new LoginReqDTO();
        dto.email = body.email;
        dto.password = body.password;
        dto.name = body.name;

        // SignupRequestDTO.validation(dto);
        return dto;
    }
}
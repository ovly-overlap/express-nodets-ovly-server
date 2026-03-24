export class LoginResDTO{
    json(_token: { token: string; }) {
      throw new Error('Method not implemented.');
    }
    token: object; 

    static of(body: any): LoginResDTO {
        const dto = new LoginResDTO();
        dto.token = body._token || body.token;

        // LoginRes.validation(dto);
        return dto;
    }
}
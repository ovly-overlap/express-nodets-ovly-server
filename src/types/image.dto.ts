import Images from '../models/images.js';

export class CreateImageDTO{
    target_id!:number;
    target_type!: string // TargetType enum
    image_url!: string[];

    // createdAt, id=X
    static of(body: any): CreateImageDTO{
        const dto = new CreateImageDTO();
        dto.target_id = body.target_id;
        dto.target_type = body.target_type;
        dto.image_url = body.image_url;
        return dto;
    }
}

// export class UpdateImageDTO{

// }

export class ImagesProfileResponseDTO{

}

export class ImagesPostResponseDTO{
    post_id!:number;
    target_type!: string // TargetType enum
    image_url!: string[];
    image_index!: number;

    // static from(images Images): ImagesResponseDTO{
    //     return{

    //     }
    // }
}
import Images from '../models/images.js';

export class CreateImageDTO{
    target_id!:number;
    target_type!: string // TargetType enum
    image_url!: string;
    image_index!: number;

    // createdAt, id=X
    static of(body: any): CreateImageDTO{
        const dto = new CreateImageDTO();
        dto.target_id = body.target_id;
        dto.target_type = body.target_type;
        dto.image_url = body.image_url;
        dto.image_index = body.image_index;
        return dto;
    }
}

export class UpdateImageDTO{

}

export class ImagesResponseDTO{
    target_id!:number;
    target_type!: string // TargetType enum
    image_url!: string;
    image_index!: number;
}
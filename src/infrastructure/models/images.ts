
import { AllowNull, Column, Model, Table, DataType, PrimaryKey, AutoIncrement, Default, BelongsTo } from "sequelize-typescript";


// TODO : 이외 타입 찾아서 쓰기
export enum TargetType {
    POST, PROFILE
}

@Table({
    tableName:"images",
    timestamps: true,
    createdAt: "created_at"
})
class Images extends Model{
    @AutoIncrement
    @PrimaryKey
    @Column({type:DataType.INTEGER})
    id!:number;

    @AllowNull(false)
    @Column({type:DataType.INTEGER})
    target_id!: number; // 게시글, 스케줄 등에 대한 id

    @Column({type:DataType.STRING})
    target_type!: string;

    @Column({type:DataType.STRING})
    image_url!: string;

    @Column({
        type:DataType.SMALLINT
    })
    @Default(0)
    image_index!: number;


    readonly created_at!:Date;
    readonly deleted_at!:Date;

    // @BelongsTo(()=>)
}

export default Images;

import { AllowNull, Column, Model, Table, DataType, PrimaryKey, AutoIncrement, Default, BelongsTo } from "sequelize-typescript";


// TODO : 이외 타입 찾아서 쓰기
export enum TargetType {
    POST, SCHEDULE, PROFILE
}

@Table({
    tableName:"images",
    timestamps: true,
    createdAt: "created_at"
})
class Images extends Model{
    @AutoIncrement
    @PrimaryKey
    id!:number;

    @AllowNull(false)
    @Column
    target_id!: number; // 게시글, 스케줄 등에 대한 id

    @Column
    target_type!: string;

    @Column({
        type:DataType.TEXT
    })
    image_url!: string;

    @Default(0)
    @Column({
        type:DataType.SMALLINT
    })
    image_index!: number;


    readonly created_at!:Date;

    // @BelongsTo(()=>)
}

export default Images;
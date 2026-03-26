import 'reflect-metadata';
import { Optional } from 'sequelize';
import {Table, Model, Column, DataType, Default, PrimaryKey, AutoIncrement, DeletedAt, AllowNull} from 'sequelize-typescript';

interface NewsAttributes{
    id: number;
    article_title: string;
    article_source: string;
    article_image_url: string;
    content: string;
    click_count: number;
    scrolled_at: Date;
    deleted_at: Date;
}

// 생성할때 id랑 기본값 필드 선택사항으로 하기
// interface NewsCreationAttributes extends Optional<NewsAttributes, 'id'>{}
interface NewsCreationAttributes extends Optional<NewsAttributes, 'id' | 'click_count' | 'deleted_at'> {}

@Table({
    tableName: 'news',
    timestamps: true,
    paranoid: true,
    deletedAt: "deleted_at",
    createdAt: "created_at"
})
class News extends Model<NewsAttributes, NewsCreationAttributes>{ //  implements  NewsAttributes
    @Column({type:DataType.INTEGER})
    @PrimaryKey
    @AutoIncrement
    id!: number;
    
    @AllowNull(false)
    @Column({type:DataType.STRING})
    article_title!: string;
    
    @AllowNull(false)
    @Column({type:DataType.STRING})
    article_source!: string;

    @AllowNull(false)
    @Column({type:DataType.TEXT})
    article_image_url!: string;

    @AllowNull(false)
    @Column({type:DataType.TEXT})
    content!: string;

    @AllowNull(false)
    @Column({type:DataType.INTEGER})
    @Default(0)
    click_count!: number;

    @AllowNull(false)
    @Column({type:DataType.DATE})
    scraped_at!: Date;

    readonly created_at: Date;
    readonly deleted_at: Date;
}

export default News;
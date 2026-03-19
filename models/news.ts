import {Optional} from "sequelize";
import {Table, Model} from 'sequelize-typescript';

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

interface NewsCreationAttributes extends Optional<NewsAttributes, 'id'>{}

@Table
class News extends Model<NewsAttributes, NewsCreationAttributes>{
    
}
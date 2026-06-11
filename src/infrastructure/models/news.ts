import "reflect-metadata";
import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  Default,
  PrimaryKey,
  AutoIncrement,
  DeletedAt,
  AllowNull,
} from "sequelize-typescript";

interface NewsAttributes {
  id: number;
  title: string;
  url: string;
  image_url: string;
  content: string;
  click_count: number;
}

// 생성할때 id랑 기본값 필드 선택사항으로 하기
// interface ArticleCreationAttributes extends Optional<ArticleAttributes, 'id'>{}
interface NewsAttributesCreate extends Optional<NewsAttributes, "id"> {}

@Table({
  // 하드삭제 paranoid no
  tableName: "articles",
  timestamps: true,
  deletedAt: "deletedAt",
  createdAt: "createdAt",
})
class News extends Model<NewsAttributes, NewsAttributesCreate> {
  //  implements  ArticleAttributes
  @Column({ type: DataType.INTEGER })
  @PrimaryKey
  @AutoIncrement
  id!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  title!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  url!: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, unique: true })
  image_url!: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  content!: string;
}

export default News;

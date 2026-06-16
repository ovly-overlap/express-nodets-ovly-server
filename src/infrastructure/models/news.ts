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
}

// 생성할때 id랑 기본값 필드 선택사항으로 하기
// interface ArticleCreationAttributes extends Optional<ArticleAttributes, 'id'>{}
interface NewsAttributesCreate extends Optional<NewsAttributes, "id"> {}

@Table({
  // 하드삭제 paranoid no
  tableName: "news",
  timestamps: true,
  deletedAt: "deletedAt",
  createdAt: "createdAt",
})
class News extends Model<NewsAttributes, NewsAttributesCreate> {
  //  implements  ArticleAttributes
  @AutoIncrement
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare title: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING, unique: true })
  declare url: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  declare image_url: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare content: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare publishedAt: Date;
}

export default News;

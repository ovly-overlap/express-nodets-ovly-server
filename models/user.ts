import { Optional } from 'sequelize';
import { Table, Model } from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  name: string;
  pw: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
  // 만들때 id없어도됌

@Table
class User extends Model<UserAttributes, UserCreationAttributes>{
  public id!: number;
  public name!: string;
  public pw!: string;
}
import { Optional } from 'sequelize';
import { Table, Model, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  email: string;
  name: string;
  pw: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
  // 만들때 id없어되길 바라며 씀

@Table
class User extends Model<UserAttributes, UserCreationAttributes>{
  @AutoIncrement
  @PrimaryKey
  public id!: number;
  public email!: string;
  public name!: string;
  public pw!: string;
}

export default User;
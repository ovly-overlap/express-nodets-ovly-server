import { Optional } from 'sequelize';
import { Table, Model, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

interface UserAttributes {
  id: number;
  email: string;
  name: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
  // 만들때 id없어되길 바라며 씀

@Table
class User extends Model<UserAttributes, UserCreationAttributes>{
  static findByToken(token: any, arg1: (err: any, user: any) => any) {
    throw new Error("Method not implemented.");
  }
  @AutoIncrement
  @PrimaryKey
  public id!: number;
  public email!: string;
  public name!: string;
  public password!: string;
}

export default User;
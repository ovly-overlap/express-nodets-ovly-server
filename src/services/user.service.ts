import { AppError } from "@/utils/appError.js";
import Users from "@/models/users.js";

export interface IUserService{
  getAllUsers(page?:number, limit?:number);
  getUserById(id:string): Promise<Users>;
  updateUser(id:string, data:any): Promise<[affectedCount: number]>;
  deleteUser(id:string): Promise<void>;
  createUser(data:{username:string, password:string});
}

export class UserService implements IUserService{
  constructor(){}

  async getAllUsers(page=1, limit=10){
    const skip = (page-1)*limit;
    return await Users.findAll();
  }

  async getUserById(id: string){
    const user = await Users.findByPk(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async updateUser(id:string, data:any){
    return Users.update(
      {
        ...data
      },
      {
        where:{id: id}
      }
    );
  }

  async deleteUser(id: string){
    await Users.destroy({where:{id:id}})
  }

  async createUser(data:{
    username: string;
    password: string;
  }){
    return Users.create({...data});
  }
}

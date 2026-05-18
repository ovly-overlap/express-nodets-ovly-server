import express, {Response, Request, NextFunction} from "express";
import {UserService, IUserService} from "../services/user.service.js";
import { BaseController } from "./base.controller.ts";
import { AppError } from "@/utils/appError.ts";

// const userService = 

export interface IUserController{
  getAll(req:Request, res:Response, next:NextFunction): Promise<void>;
  getUser(req:Request, res:Response, next:NextFunction): Promise<void>;
  create(req:Request, res:Response, next:NextFunction): Promise<void>;
  update(req:Request, res:Response, next:NextFunction): Promise<void>;
  delete(req:Request, res:Response, next:NextFunction): Promise<void>;
};

class UserController extends BaseController implements IUserController{
  private userService: IUserService;
  constructor(userService: UserService){
    super();
    this.userService = userService;
  }

  getAll = async(req:Request, res:Response, next:NextFunction): Promise<void> =>{
    await this.handleRequest(req, res, next, async()=>{
      return await this.userService.getAllUsers();
    })
  }
  
  getUser = async(req:Request, res:Response, next:NextFunction): Promise<void> =>{
    await this.handleRequest(req, res, next, async()=>{
      if(!req.user || req.user.userId !== req.params.id){
        throw new AppError("not authorized profile", 403);
      }
      return await this.userService.getUserById(req.params.id[0]);
    });
  }

  create = async (req:Request, res:Response, next:NextFunction): Promise<void> =>{
    await this.handleRequest(req, res, next, async()=>{
      return await this.userService.createUser(req.body);
    });
  }

  update = async (req:Request, res:Response, next:NextFunction): Promise<void> =>{
    await this.handleRequest(req, res, next, async()=>{
      return await this.userService.updateUser(req.params.id[0], req.body);
    });
  }

  delete = async (req:Request, res:Response, next:NextFunction): Promise<void> =>{
    await this.handleRequest(req, res, next, async()=>{
      await this.userService.deleteUser(req.params.id[0]);
      return null;
    });
  }
}


const userService = new UserService();
export const userController = new UserController(userService);
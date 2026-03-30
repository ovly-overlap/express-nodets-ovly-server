import express, {Response, Request} from "express";
import { validationResult } from "express-validator";
import * as userService from "../services/user.service.js";

// const userService = 

export const getUsers = (req:Request, res:Response) =>{
    const users = userService.getUsers();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    console.log(req.body);
    res.json(users);
};

// @Controller('events')
// class EventsController {
//   @Post()
//   create(@Body() dto: CreateEventDto) {
//     return this.service.create(dto);
//   }
// }

export const createUser = async (req:Request, res:Response) => {
  const user = await userService.createUser(req.body)
  res.json(user)
}


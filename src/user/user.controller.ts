import { Controller, Get, Post, Body, Render, Res,Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { UserDto } from './dto/UserDto'
import { Response,Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { tokenPool } from '../tokenPool';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwt: JwtService) { }

  @Get()
  @Render('index')
  root() {
    return this.userService.getRoot();
  }
  @Get("cookie")
  getCookie(@Req() req:Request,  @Res() res: Response){
    let cookie = req.cookies.sapia_token
    if(cookie &&  tokenPool.includes(cookie)) res.send("matched")
  }

  @Post("check")
  async checkUser(@Body() userDto: UserDto, @Res() req: Response) {
    let res = await this.userService.checkUser(userDto)
    console.log(res)
    if (res === "matched") {
      let jwt = this.jwt.sign({ username: userDto.username, timestamp: Date.now() },{secret:"123456"})
      req.cookie('sapia_token',jwt, { maxAge: 7 * 60 * 60 * 24 * 1000 })
      tokenPool.push(jwt)
    } 
    req.send(res)
  }

  @Get("data")
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}

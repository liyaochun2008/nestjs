import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'
const DBRootModule = MongooseModule.forRoot("mongodb+srv://smartleoyaochun:840yingG@cluster0.tfi8vui.mongodb.net/user")


@Module({
  imports: [DBRootModule,UserModule,JwtModule],
})
export class AppModule { }

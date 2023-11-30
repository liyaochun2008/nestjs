import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        secret: '123456',
        signOptions: { expiresIn: '100h' }
      }
    },
  }), MongooseModule.forFeature([{ name: 'User', schema: UserSchema, collection: 'user' }]),],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
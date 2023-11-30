import { Injectable } from '@nestjs/common';
import { UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dto/UserDto'
import { lockCount } from '../tokenPool'

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly Model: Model<UserDocument>) { }

  getRoot(): string {
    return 'Hello World!'
  }

  async checkUser(userDto: UserDto): Promise<string> {
    let rep = ""
    let res = await this.Model.findOne({ username: userDto.username }).exec()
    if (!res) rep = 'username not existed'
    else {
      if (res.locked) {
        return 'account has been locked'
      }
      if (userDto.password !== res.password) {
        let lockTarget = lockCount.find(item => item.username === userDto.username)
        let count = 2;
        let now: number = Date.now()
        if (lockTarget) {
          if (now - lockTarget.freezeTime < 60 * 1000 * 5) {
            lockTarget.times++
            if (lockTarget.times === 3) {
              let res = await this.lockAccount(lockTarget.username)
              if (res.acknowledged) return 'account has been locked'
            }
            count = count - lockTarget.times + 1
          } else {
            lockTarget.freezeTime = now
            lockTarget.times = 0
          }
        } else {
          lockCount.push({ username: userDto.username, times: 1, freezeTime: now })
        }
        rep = '<div style="text-align:center"><p>password is incorrect</p><p>your can try another <span style="color:red">' + count + '</span> times in 5 mins</p><p>or your account will be locked</p></div>'
      } else {
        rep = 'matched'
      }
    }
    return rep
  }

  lockAccount(username: string) {
    return this.Model.updateOne({ username: username }, { $set: { locked: 1 } }).exec()
  }

  findAll() {
    console.log("search all")
    return this.Model.find().exec();
  }
}

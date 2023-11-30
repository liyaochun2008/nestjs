import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let userService: UserService;

  describe('CatsService', () => {
    let userService: UserService;
    let model: Model<User>;

    let res = [{
      _id: 111,
      username: '123456',
      password: '123456',
      locked: 0
    }]

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          UserService,
          {
            provide: getModelToken('User'),
            useValue: {
              find: jest.fn(),
              findOne: jest.fn(),
              updateOne: jest.fn()
            },
          },
        ],
      }).compile();

      userService = module.get<UserService>(UserService);
      model = module.get<Model<User>>(getModelToken('User'));
    });

    it('should be defined', () => {
      expect(userService).toBeDefined();
    });

    it('should return all return', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(res),
      } as any);
      const result = await userService.findAll();
      expect(result).toEqual(res);
    });

    it('should findOne', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(res[0]),
      } as any)
      const checkres = await userService.checkUser({
        username: '123456',
        password: '123456'
      });
      expect(checkres).toEqual("matched");
    });

    it('should updateOne', async () => {
      jest.spyOn(model, 'updateOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(1),
      } as any)
      const checkres = await userService.lockAccount('123456');
      expect(checkres).toEqual(1);
    });
   
  });
});
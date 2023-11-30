import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service'
import { UserDto } from './dto/UserDto';
import { JwtModule } from '@nestjs/jwt'
import { Response } from 'express'

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({
        secret: '123456',
      })],
      controllers: [UserController],
      providers: [{
        provide: UserService,
        useValue: {
          findAll: jest.fn().mockResolvedValue([
            {
              _id: 111,
              username: 'test1',
              password: '123456',
              locked: 0
            }
          ]),
          checkUser: jest.fn().mockResolvedValue(UserDto),
        }
      }]
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  describe('checkUser()', () => {

    it('should get a result', async () => {
      const result = "unmatched"
      const mockCallback = jest.fn((res) => {
        expect(res).toEqual(result);
      });

      const res = { send: mockCallback } as unknown as Response;

      const checkSpy = jest
        .spyOn(userService, 'checkUser')
        .mockResolvedValueOnce("unmatched");

      await userController.checkUser(new UserDto(), res);
      expect(checkSpy).toHaveBeenCalledTimes(1)
    });
  });


  describe('findAll()', () => {
    it('should return all data from database', async () => {
      expect(userController.findAll()).resolves.toEqual([
        {
          _id: 111,
          username: 'test1',
          password: '123456',
          locked: 0
        }
      ]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });
});


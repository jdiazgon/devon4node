import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceMock } from '../../../../../test/auth/auth.service.mock';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'none' })],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined after module initialization', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return the JWT token when the user is correct', async () => {
      const user: any = {
        username: 'user1',
        password: 'user1',
      };

      const sendMock = {
        send: jest.fn(),
      };
      const mockResponse: any = {
        // tslint:disable-next-line: variable-name
        status: jest.fn().mockImplementation(_x => sendMock),
        setHeader: jest.fn(),
      };
      const value = await controller.login(user, mockResponse);
      expect(value).toBeUndefined();
      expect(mockResponse.status).toBeCalledWith(200);
      expect(sendMock.send).toBeCalledWith();
      expect(mockResponse.setHeader).toBeCalledWith('Authorization', 'Bearer THISISNOTAJWTTOKEN');
    });
    it('should throw an error when the username or password are not correct', async () => {
      await expect(
        controller.login(
          {
            username: 'user2',
            password: 'user1',
          },
          // response not needed
          {} as any,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register the user if not exists', async () => {
      await expect(
        controller.register({
          username: 'user2',
          password: 'user2',
          role: 1,
        } as any),
      ).resolves.toEqual({ username: 'user2', role: 1 });
    });
    it('should throw an error when user already exists', async () => {
      await expect(
        controller.register({
          username: 'user1',
          password: 'user1',
          role: 1,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('currentUser', () => {
    it('should return the validated user in the request', () => {
      const request: any = {
        user: {
          username: 'user1',
        },
      };
      expect(controller.currentUser(request)).toEqual(request.user);
    });
    // The auth guard will rejects all request if the user is not present or invalid,
    // so we do not need to test those use case here.
  });
});

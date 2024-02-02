import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { AuthenticationResponse, LoginRequest } from '../auth/auth';
import { UserResponse } from './user';
import { RpcException } from '@nestjs/microservices';
import { AppModule } from '../app.module';

describe('tesing user service', () => {
  let app: TestingModule;
  let userToTest: AuthenticationResponse;
  let userService: UserService;
  let authService: AuthService;

  const login = async (
    username: string,
    password: string,
  ): Promise<AuthenticationResponse> => {
    const loginRequest: LoginRequest = {
      username,
      password,
    };

    return authService.login(loginRequest);
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = app.get<UserService>(UserService);
    authService = app.get<AuthService>(AuthService);

    expect(userService).toBeDefined();
    expect(authService).toBeDefined();

    userToTest = await authService.register({
      username: 'userToTest',
      email: 'userToTest@gmail.com',
      password: '12345',
    });
  }, 20000);

  afterAll(async () => {
    await app.close();
  });
  test('test get user info', async () => {
    const user: UserResponse = await userService.findCurrentUserInfo(
      userToTest.id,
    );
    expect(user).toMatchObject({
      username: userToTest.username,
      email: userToTest.email,
      id: userToTest.id,
    });
  });

  test('test fail get user info', async () => {
    await expect(() =>
      userService.findCurrentUserInfo('unexistedId'),
    ).rejects.toThrow(RpcException);
  });

  test('test update user name, email and password', async () => {
    const updateUsername: UserResponse = await userService.updateUsername(
      userToTest.id,
      'changedUserName',
      userToTest.username,
    );

    expect(updateUsername.username).not.toEqual(userToTest.username);

    const updateEmail: UserResponse = await userService.updateUserEmail(
      userToTest.id,
      'changedEmail',
      userToTest.email,
    );

    expect(updateUsername.username).not.toEqual(userToTest.username);

    await expect(() => login(updateEmail.username, '12345')).not.toThrow(
      RpcException,
    );
  });
});

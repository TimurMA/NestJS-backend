import { Test, TestingModule } from '@nestjs/testing';

import { config } from 'dotenv';
import { execSync } from 'child_process';
import { AuthService } from './auth.service';
import { AuthenticationResponse, LoginRequest, RegisterRequest } from './auth';
import { AppModule } from '../app.module';
import { RpcException } from '@nestjs/microservices';

config({ path: '../.env' });

describe('testing Auth service', () => {
  let app: TestingModule;
  let authService: AuthService;

  const registerUser = async (
    username: string,
    email: string,
    password: string,
  ): Promise<AuthenticationResponse> => {
    const registerRequest: RegisterRequest = {
      username,
      email,
      password,
    };
    return authService.register(registerRequest);
  };

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
    execSync('npm run migrate');

    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  }, 20000);

  afterAll(async () => {
    await app.close();
  });

  test('test register and login user', async () => {
    const registerAuthenticationResponse: AuthenticationResponse =
      await registerUser('register1', 'register1@gmail.com', '1234');
    expect(registerAuthenticationResponse).not.toBeNull();
    expect(registerAuthenticationResponse.token).toBeDefined();
    expect(registerAuthenticationResponse.username).toEqual('register1');
    expect(registerAuthenticationResponse.email).toEqual('register1@gmail.com');

    const loginAuthenticationResponse = await login('register1', '1234');

    expect(loginAuthenticationResponse.token).toBeDefined();
    loginAuthenticationResponse.token = registerAuthenticationResponse.token;
    expect(loginAuthenticationResponse).toMatchObject(
      registerAuthenticationResponse,
    );
  });
  test('test fail register', async () => {
    await expect(() =>
      authService.register({
        username: null,
        email: 'gwrgw2',
        password: 'gr',
      }),
    ).rejects.toThrow(RpcException);

    await registerUser('registeredUser', 'registeredUserEmail@gme.r', '1234');

    await expect(() =>
      authService.register({
        username: 'registeredUser',
        email: 'gwrgw2',
        password: 'gr',
      }),
    ).rejects.toThrow(RpcException);

    await expect(() =>
      authService.register({
        username: 'registeefredUser',
        email: 'registeredUserEmail@gme.r',
        password: 'gr',
      }),
    ).rejects.toThrow(RpcException);
  });
  test('fail login', async () => {
    const authenticationResponse: AuthenticationResponse = await registerUser(
      'existedUsername',
      'existedEmail@email.com',
      '12345',
    );

    await expect(() =>
      authService.login({
        username: authenticationResponse.username,
        password: 'gr',
      }),
    ).rejects.toThrow(RpcException);

    await expect(() =>
      authService.login({
        username: 'unexistedUsername',
        password: 'gr',
      }),
    ).rejects.toThrow(RpcException);
  });
});

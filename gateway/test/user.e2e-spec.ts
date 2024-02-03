import { INestApplication } from '@nestjs/common';
import {
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
} from '../src/auth/auth';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  ChangeUsernameRequest,
  UserResponse,
} from '../src/user/user';
import { RpcExceptionFilter } from '../src/filter/exception.filter';

describe('UserController', () => {
  let app: INestApplication;
  let userToTest: AuthenticationResponse;
  let stranger: AuthenticationResponse;

  const register = (
    username: string,
    email: string,
    password: string,
  ): request.Test => {
    const registerRequest: RegisterRequest = {
      username,
      email,
      password,
    };

    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(registerRequest);
  };

  const login = (username: string, password: string): request.Test => {
    const loginRequest: LoginRequest = {
      username,
      password,
    };

    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send(loginRequest);
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new RpcExceptionFilter());
    await app.init();

    stranger = await register('stranger', 'stranger@stranger.ru', 'stranger')
      .expect(201)
      .expect((response) => {
        expect(response.body.token).toBeDefined();
        expect(response.body.username).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.id).toBeDefined();
      })
      .then((response) => response.body);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    userToTest = await register(
      'userToTest' + randomUUID({ disableEntropyCache: true }),
      'userToTest' + randomUUID({ disableEntropyCache: true }) + '@user.ru',
      'user',
    )
      .expect(201)
      .expect((response) => {
        expect(response.body.token).toBeDefined();
        expect(response.body.username).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.id).toBeDefined();
      })
      .then((response) => response.body);
  });

  test('successful login', async () => {
    await login(userToTest.username, 'user')
      .expect(201)
      .expect((response) => {
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.username).toEqual(userToTest.username);
        expect(response.body.email).toEqual(userToTest.email);
        expect(response.body.token).toBeDefined();
      });
  });

  test('successful get user info', async () => {
    await request(app.getHttpServer())
      .get(`/api/user/${userToTest.id}`)
      .set('Authorization', `Bearer ${userToTest.token}`)
      .send()
      .expect(200)
      .expect((response) => {
        expect(response.body.username).toEqual(userToTest.username);
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.email).toEqual(userToTest.email);
      });
  });

  test('update userToTest`s username by userToTest', async () => {
    const oldUsername: string = userToTest.username;

    const updateUsernameRequest: ChangeUsernameRequest = {
      newUsername: 'newUsername',
      oldUsername,
    };

    const updatedUser: UserResponse = await request(app.getHttpServer())
      .patch('/api/user/update/username')
      .set('Authorization', `Bearer ${userToTest.token}`)
      .send(updateUsernameRequest)
      .expect(200)
      .expect((response) => {
        expect(response.body.username).not.toEqual(oldUsername);
        expect(response.body.username).toEqual(
          updateUsernameRequest.newUsername,
        );
      })
      .then((response) => response.body);

    await login(updatedUser.username, 'user')
      .expect(201)
      .expect((response) => {
        expect(response.body.username).toEqual(updatedUser.username);
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.email).toEqual(userToTest.email);
        expect(response.body.token).toBeDefined();
      });

    await login(oldUsername, 'user')
      .expect(500)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Authorization is not successful',
        );
        expect(response.body.statusCode).toEqual(500);
      });
  });

  test('update userToTest`s username by stranger', async () => {
    const oldUsername: string = userToTest.username;

    const updateUsernameRequest: ChangeUsernameRequest = {
      newUsername: 'newUsernameByStranger',
      oldUsername,
    };

    await request(app.getHttpServer())
      .patch('/api/user/update/username')
      .set('Authorization', `Bearer ${stranger.token}`)
      .send(updateUsernameRequest)
      .expect(500)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Change username is not successful',
        );
        expect(response.body.statusCode).toEqual(500);
      });

    await login(oldUsername, 'user')
      .expect(201)
      .expect((response) => {
        expect(response.body.username).toEqual(oldUsername);
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.email).toEqual(userToTest.email);
        expect(response.body.token).toBeDefined();
      });

    await login(updateUsernameRequest.newUsername, 'user')
      .expect(500)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Authorization is not successful',
        );
        expect(response.body.statusCode).toEqual(500);
      });
  });

  test('update userToTest`s email by userToTest', async () => {
    const oldEmail: string = userToTest.email;

    const updateEmailRequest: ChangeEmailRequest = {
      newEmail: 'newEmail@user.domen',
      oldEmail,
    };

    const updatedUser: UserResponse = await request(app.getHttpServer())
      .patch('/api/user/update/email')
      .set('Authorization', `Bearer ${userToTest.token}`)
      .send(updateEmailRequest)
      .expect(200)
      .expect((response) => {
        expect(response.body.email).not.toEqual(oldEmail);
        expect(response.body.email).toEqual(updateEmailRequest.newEmail);
      })
      .then((response) => response.body);

    await login(updatedUser.username, 'user')
      .expect(201)
      .expect((response) => {
        expect(response.body.username).toEqual(userToTest.username);
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.email).toEqual(updatedUser.email);
        expect(response.body.email).not.toEqual(oldEmail);
        expect(response.body.token).toBeDefined();
      });
  });

  test('update userToTest`s email by stranger', async () => {
    const oldEmail: string = userToTest.email;

    const updateEmailRequest: ChangeEmailRequest = {
      newEmail: 'newEmail@user.domen',
      oldEmail,
    };

    await request(app.getHttpServer())
      .patch('/api/user/update/email')
      .set('Authorization', `Bearer ${stranger.token}`)
      .send(updateEmailRequest)
      .expect(500)
      .expect((response) => {
        expect(response.body.message).toEqual('Change email is not successful');
        expect(response.body.statusCode).toEqual(500);
      });

    await login(userToTest.username, 'user')
      .expect(201)
      .expect((response) => {
        expect(response.body.username).toEqual(userToTest.username);
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.email).not.toEqual(updateEmailRequest.newEmail);
        expect(response.body.email).toEqual(oldEmail);
        expect(response.body.token).toBeDefined();
      });
  });

  test('update userToTest`s password by userToTest', async () => {
    const updatePasswordRequest: ChangePasswordRequest = {
      newPassword: 'newPass',
      oldPassword: 'user',
    };

    await request(app.getHttpServer())
      .patch('/api/user/update/password')
      .set('Authorization', `Bearer ${userToTest.token}`)
      .send(updatePasswordRequest)
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toEqual('Password successfully changed');
        expect(response.body.statusCode).toEqual(200);
      });

    await login(userToTest.username, updatePasswordRequest.newPassword)
      .expect(201)
      .expect((response) => {
        expect(response.body.username).toEqual(userToTest.username);
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.email).toEqual(userToTest.email);
        expect(response.body.token).toBeDefined();
      });

    await login(userToTest.username, updatePasswordRequest.oldPassword)
      .expect(500)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Authorization is not successful',
        );
        expect(response.body.statusCode).toEqual(500);
      });
  });

  test('update userToTest`s password by stranger', async () => {
    const updatePasswordRequest: ChangePasswordRequest = {
      newPassword: 'newPass',
      oldPassword: 'user',
    };

    await request(app.getHttpServer())
      .patch('/api/user/update/password')
      .set('Authorization', `Bearer ${stranger.token}`)
      .send(updatePasswordRequest)
      .expect(500)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Change password is not successful',
        );
        expect(response.body.statusCode).toEqual(500);
      });

    await login(userToTest.username, updatePasswordRequest.newPassword)
      .expect(500)
      .expect((response) => {
        expect(response.body.message).toEqual(
          'Authorization is not successful',
        );
        expect(response.body.statusCode).toEqual(500);
      });

    await login(userToTest.username, updatePasswordRequest.oldPassword)
      .expect(201)
      .expect((response) => {
        expect(response.body.username).toEqual(userToTest.username);
        expect(response.body.id).toEqual(userToTest.id);
        expect(response.body.email).toEqual(userToTest.email);
        expect(response.body.token).toBeDefined();
      });
  });
});

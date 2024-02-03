import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  ChangeUsernameRequest,
  Response,
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserDTO,
  UserResponse,
  UserServiceClient,
} from './user';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationPrincipal } from '../utils/jwt-auth/jwt-auth.authentication.principal';

@Controller('/api/user')
export class UserController {
  private userService: UserServiceClient;
  constructor(
    @Inject(USER_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @Get('/:id')
  getCurrentUserInfo(
    @Param('id') id: string,
  ): Observable<UserResponse | Response> {
    return this.userService
      .getCurrentUserInfo({ userId: id })
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Patch('/update/username')
  updateUsername(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() userToUpdate: ChangeUsernameRequest,
  ): Observable<UserResponse | Response> {
    userToUpdate.userId = currentUser.id;
    return this.userService
      .updateUsername(userToUpdate)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Patch('/update/email')
  updateEmail(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() userToUpdate: ChangeEmailRequest,
  ): Observable<UserDTO | Response> {
    userToUpdate.userId = currentUser.id;
    return this.userService
      .updateUserEmail(userToUpdate)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Patch('/update/password')
  updatePassword(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() passwordToChange: ChangePasswordRequest,
  ): Observable<Response> {
    passwordToChange.userId = currentUser.id;
    return this.userService
      .updateUserPassword(passwordToChange)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}

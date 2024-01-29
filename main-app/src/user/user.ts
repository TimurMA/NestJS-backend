/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'user';

export interface Response {
  message: string;
  statusCode: number;
}

export interface UserRequest {
  userId: string;
}

export interface UserResponse {
  username: string;
  email: string;
  id: string;
}

export interface ChangePasswordRequest {
  newPassword: string;
  oldPassword: string;
  userId: string;
}

export interface ChangeUsernameRequest {
  newUsername: string;
  userId: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  userId: string;
}

export const USER_PACKAGE_NAME = 'user';

export interface UserServiceController {
  getCurrentUserInfo(
    request: UserRequest,
  ): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  updateUsername(
    request: ChangeUsernameRequest,
  ): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  updateUserEmail(
    request: ChangeEmailRequest,
  ): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  updateUserPassword(
    request: ChangePasswordRequest,
  ): Promise<Response> | Observable<Response> | Response;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getCurrentUserInfo',
      'updateUsername',
      'updateUserEmail',
      'updateUserPassword',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('UserService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const USER_SERVICE_NAME = 'UserService';

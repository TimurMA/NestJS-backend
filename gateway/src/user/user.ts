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
  userId?: string;
}

export interface ChangeUsernameRequest {
  newUsername: string;
  oldUsername: string;
  userId?: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  oldEmail: string;
  userId?: string;
}

export interface UserDTO {
  username: string;
  email: string;
  id: string;
}

export const USER_PACKAGE_NAME = 'user';

export interface UserServiceClient {
  getCurrentUserInfo(request: UserRequest): Observable<UserResponse>;

  updateUsername(request: ChangeUsernameRequest): Observable<UserResponse>;

  updateUserEmail(request: ChangeEmailRequest): Observable<UserResponse>;

  updateUserPassword(request: ChangePasswordRequest): Observable<Response>;
}

export const USER_SERVICE_NAME = 'UserService';

/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Observable } from 'rxjs';

export const protobufPackage = 'user';

export class Response {
  @ApiProperty()
  message: string;
  @ApiProperty()
  statusCode: number;
}

export class UserRequest {
  @ApiProperty()
  userId: string;
}

export class UserResponse {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
}

export class ChangePasswordRequest {
  @ApiProperty()
  newPassword: string;
  @ApiProperty()
  oldPassword: string;
  @ApiProperty()
  userId?: string;
}

export class ChangeUsernameRequest {
  @ApiProperty()
  newUsername: string;
  @ApiProperty()
  oldUsername: string;
  @ApiProperty()
  userId?: string;
}

export class ChangeEmailRequest {
  @ApiProperty()
  @IsEmail()
  newEmail: string;
  @ApiProperty()
  oldEmail: string;
  @ApiProperty()
  userId?: string;
}

export class UserDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
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

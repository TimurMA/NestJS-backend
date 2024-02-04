/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Observable } from 'rxjs';

export const protobufPackage = 'auth';

export class AuthenticationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  token: string;
}

export class LoginRequest {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class RegisterRequest {
  @ApiProperty()
  username: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  password: string;
}

export const AUTH_PACKAGE_NAME = 'auth';

export interface AuthServiceClient {
  login(request: LoginRequest): Observable<AuthenticationResponse>;

  register(request: RegisterRequest): Observable<AuthenticationResponse>;
}

export const AUTH_SERVICE_NAME = 'AuthService';

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'auth';

export interface AuthenticationResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const AUTH_PACKAGE_NAME = 'auth';

export interface AuthServiceClient {
  login(request: LoginRequest): Observable<AuthenticationResponse>;

  register(request: RegisterRequest): Observable<AuthenticationResponse>;
}

export const AUTH_SERVICE_NAME = 'AuthService';

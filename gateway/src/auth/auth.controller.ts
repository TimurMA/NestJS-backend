import { Controller, Inject, OnModuleInit, Post, Body } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
} from './auth';
import { Observable, catchError, throwError } from 'rxjs';

@Controller('/api/auth')
export class AuthController implements OnModuleInit {
  private authService: AuthServiceClient;
  constructor(
    @Inject(AUTH_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  @Post('/register')
  register(
    @Body() request: RegisterRequest,
  ): Observable<AuthenticationResponse | Response> {
    return this.authService
      .register(request)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Post('/login')
  login(
    @Body() request: LoginRequest,
  ): Observable<AuthenticationResponse | Response> {
    return this.authService
      .login(request)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}

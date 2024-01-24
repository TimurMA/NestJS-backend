import { Body, Controller, Post } from '@nestjs/common';

import { AuthenticationResponse } from './model/response/authentication.response';
import { RegisterRequest } from './model/request/register.request';
import { LoginRequest } from './model/request/login.request';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() registerRequest: RegisterRequest,
  ): Promise<AuthenticationResponse> {
    return await this.authService.register(registerRequest);
  }

  @Post('/login')
  async login(
    @Body() loginRequest: LoginRequest,
  ): Promise<AuthenticationResponse> {
    return await this.authService.login(loginRequest);
  }
}

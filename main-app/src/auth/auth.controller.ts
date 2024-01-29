import { Body, Controller } from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
} from './auth';

@Controller('/api/auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  register(
    @Body() registerRequest: RegisterRequest,
  ): Promise<AuthenticationResponse> {
    return this.authService.register(registerRequest);
  }

  login(@Body() loginRequest: LoginRequest): Promise<AuthenticationResponse> {
    return this.authService.login(loginRequest);
  }
}

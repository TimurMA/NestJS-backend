import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  ChangeUsernameRequest,
  Response,
  UserRequest,
  UserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from './user';

@Controller('/api/profile')
@UserServiceControllerMethods()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  getCurrentUserInfo(request: UserRequest): Promise<UserResponse> {
    return this.userService.findCurrentUserInfo(request.userId);
  }

  updateUsername(request: ChangeUsernameRequest): Promise<UserResponse> {
    return this.userService.updateUsername(
      request.userId,
      request.newUsername,
      request.oldUsername,
    );
  }

  updateUserEmail(updateUser: ChangeEmailRequest): Promise<UserResponse> {
    return this.userService.updateUserEmail(
      updateUser.userId,
      updateUser.newEmail,
      updateUser.oldEmail,
    );
  }

  async updateUserPassword(
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<Response> {
    await this.userService.updatePassword(
      changePasswordRequest.userId,
      changePasswordRequest.oldPassword,
      changePasswordRequest.newPassword,
    );
    return {
      message: 'Password successfully changed',
      statusCode: 200,
    };
  }
}

import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationPrincipal } from 'src/utils/jwt-auth/jwt-auth.authentication.principal';
import { UserDTO } from './model/dto/user.dto';

import { ChangePasswordRequest } from './model/request/change.password';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('/api/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUser')
  findUserById(data) {
    return this.userService.findCurrentUserInfo(data['userId']);
  }

  @Get('/user-info')
  async findCurrentUserInfo(@AuthenticationPrincipal() user: UserDTO) {
    console.log(user.id);
    return this.userService.findCurrentUserInfo(user.id);
  }

  @Put('/update/username')
  async updateUsername(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() updateUser: UserDTO,
  ): Promise<UserDTO> {
    return this.userService.updateUsername(currentUser.id, updateUser.username);
  }

  @Put('/update/email')
  async updateUserEmail(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() updateUser: UserDTO,
  ): Promise<UserDTO> {
    return this.userService.updateUserEmail(currentUser.id, updateUser.email);
  }

  @Put('/update/password')
  async updatePassword(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() changePasswordRequest: ChangePasswordRequest,
  ): Promise<void> {
    return this.userService.updatePassword(
      currentUser.id,
      changePasswordRequest.oldPassword,
      changePasswordRequest.newPassword,
    );
  }
}

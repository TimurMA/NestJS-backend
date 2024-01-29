import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDTO } from 'src/user/user';

export const AuthenticationPrincipal = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: UserDTO = {
      username: request['user']['username'],
      email: request['user']['email'],
      id: request['user']['id'],
    };
    return user;
  },
);

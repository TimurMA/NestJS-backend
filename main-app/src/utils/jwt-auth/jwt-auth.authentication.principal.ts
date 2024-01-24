import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDTO } from 'src/user/model/dto/user.dto';

export const AuthenticationPrincipal = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userDTO = new UserDTO(
      request['user']['username'],
      request['user']['email'],
      request['user']['id'],
    );
    return userDTO;
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/model/dto/comment.dto';
export const AuthenticationPrincipal = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userDTO: User = {
      username: request['user']['username'],
      email: request['user']['email'],
      id: request['user']['id'],
    };
    return userDTO;
  },
);

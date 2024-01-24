import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/user/model/entity/user.entity';
import { LoginRequest } from './model/request/login.request';
import { AuthenticationResponse } from './model/response/authentication.response';
import { RegisterRequest } from './model/request/register.request';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginRequest: LoginRequest): Promise<AuthenticationResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { username: loginRequest.username },
      });

      if (!user || !compareSync(loginRequest.password, user.password)) {
        throw new UnauthorizedException('Ошибка авторизации');
      }

      const token = await this.jwtService.signAsync({
        username: user.username,
        email: user.email,
        id: user.id,
      });

      return new AuthenticationResponse(
        user.id,
        user.username,
        user.email,
        token,
      );
    } catch (error) {
      throw new UnauthorizedException('Авторизация не удалась');
    }
  }

  async register(
    registerRequest: RegisterRequest,
  ): Promise<AuthenticationResponse> {
    try {
      const newUser = new User();
      newUser.email = registerRequest.email;
      newUser.password = registerRequest.password;
      newUser.username = registerRequest.username;

      const savedUser = await this.userRepository.save(newUser);

      const token = await this.jwtService.signAsync({
        username: savedUser.username,
        email: savedUser.email,
        id: savedUser.id,
      });

      return new AuthenticationResponse(
        savedUser.id,
        savedUser.username,
        savedUser.email,
        token,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Регистрация не удалась');
    }
  }
}

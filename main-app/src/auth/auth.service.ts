import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationResponse, LoginRequest, RegisterRequest } from './auth';
import { RpcException } from '@nestjs/microservices';
import { User } from '../user/model/entity/user.entity';

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
        throw new RpcException('Authorization is not successful');
      }

      const token = await this.jwtService.signAsync({
        username: user.username,
        email: user.email,
        id: user.id,
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      };
    } catch (error) {
      throw new RpcException('Authorization is not successful');
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

      return {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        token,
      };
    } catch (error) {
      console.log(error);
      throw new RpcException('Registration is not successful');
    }
  }
}

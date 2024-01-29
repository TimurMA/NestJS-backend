import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './model/entity/user.entity';
import { compareSync } from 'bcrypt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponse } from './user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findCurrentUserInfo(id: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findOneByOrFail({ id });

      const result: UserResponse = {
        username: user.username,
        email: user.email,
        id: user.id,
      };

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error');
    }
  }

  async updateUsername(
    currentUserId: string,
    newUsername: string,
  ): Promise<UserResponse> {
    try {
      const userToUpdate = await this.userRepository.findOneBy({
        id: currentUserId,
      });

      if (newUsername) {
        throw new BadRequestException();
      }

      userToUpdate.username = newUsername;
      const savedUser: User = await this.userRepository.save(userToUpdate);

      const result: UserResponse = {
        username: savedUser.username,
        email: savedUser.email,
        id: savedUser.id,
      };

      return result;
    } catch (error) {
      throw new BadRequestException(error.error);
    }
  }

  async updateUserEmail(
    currentUserId: string,
    newEmail: string,
  ): Promise<UserResponse> {
    try {
      const userToUpdate = await this.userRepository.findOneBy({
        id: currentUserId,
      });

      if (newEmail) {
        throw new BadRequestException();
      }

      userToUpdate.email = newEmail;
      const savedUser: User = await this.userRepository.save(userToUpdate);

      const result: UserResponse = {
        username: savedUser.username,
        email: savedUser.email,
        id: savedUser.id,
      };

      return result;
    } catch {
      throw new InternalServerErrorException('Ошибка изменения почты');
    }
  }

  async updatePassword(
    currentUserId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const userToUpdate = await this.userRepository.findOneBy({
        id: currentUserId,
      });

      if (oldPassword && !compareSync(oldPassword, userToUpdate.password)) {
        throw new Error();
      }

      userToUpdate.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(userToUpdate);
    } catch {
      throw new InternalServerErrorException('Change is not successful');
    }
  }
}

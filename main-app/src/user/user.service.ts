import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/user/model/entity/user.entity';
import { UserDTO } from './model/dto/user.dto';
import { compareSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findCurrentUserInfo(id: string): Promise<UserDTO> {
    try {
      const user = await this.userRepository.findOneByOrFail({ id });

      const result = new UserDTO(user.username, user.email, user.id);

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка');
    }
  }

  async updateUsername(
    currentUserId: string,
    newUsername: string,
  ): Promise<UserDTO> {
    try {
      const userToUpdate = await this.userRepository.findOneBy({
        id: currentUserId,
      });

      userToUpdate.username = newUsername;
      const savedUser: User = await this.userRepository.save(userToUpdate);

      const userDTO = new UserDTO(
        savedUser.username,
        savedUser.email,
        savedUser.id,
      );

      return userDTO;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка изменения имя пользователя',
      );
    }
  }

  async updateUserEmail(
    currentUserId: string,
    newEmail: string,
  ): Promise<UserDTO> {
    try {
      const userToUpdate = await this.userRepository.findOneBy({
        id: currentUserId,
      });

      userToUpdate.email = newEmail;
      const savedUser: User = await this.userRepository.save(userToUpdate);

      const userDTO = new UserDTO(
        savedUser.username,
        savedUser.email,
        savedUser.id,
      );

      return userDTO;
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

      userToUpdate.password = newPassword;
      await this.userRepository.save(userToUpdate);
    } catch {
      throw new InternalServerErrorException('Ошибка изменения пароля');
    }
  }
}

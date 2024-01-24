import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/model/entity/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

config({ path: '../.env' });

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET ?? 'JWT_SECRET',
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ], // Include only the entity (User) here
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

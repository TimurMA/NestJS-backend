import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from './auth';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

config({ path: '../.path' });

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: './proto/auth.proto',
          url: (process.env.MAIN_BACKEND_HOST || 'localhost') + ':50050',
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET ?? 'JWT_SECRET',
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from './auth';

const host = process.env.MAIN_BACKEND_HOST || 'localhost';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: './proto/auth.proto',
          url: host + ':50050',
        },
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}

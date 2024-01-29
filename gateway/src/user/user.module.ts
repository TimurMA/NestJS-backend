import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { USER_PACKAGE_NAME } from './user';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: './proto/user.proto',
          url: (process.env.MAIN_BACKEND_HOST || 'localhost') + ':50051',
        },
      },
    ]),
  ],
  controllers: [UserController],
})
export class UserModule {}

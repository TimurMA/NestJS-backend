import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { COMMENT_PACKAGE_NAME } from './comment';
import { config } from 'dotenv';

config({ path: '../.env' });

const host = process.env.COMMENT_BACKEND_HOST || 'localhost';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: COMMENT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: COMMENT_PACKAGE_NAME,
          protoPath: './proto/comment.proto',
          url: host + ':50052',
        },
      },
    ]),
  ],
  controllers: [CommentController],
})
export class CommentModule {}

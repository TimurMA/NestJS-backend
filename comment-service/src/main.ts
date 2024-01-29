import { NestFactory } from '@nestjs/core';
import { CommentModule } from './comment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  console.log(process.env.COMMENT_BACKEND_HOST);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommentModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'comment',
        protoPath: './proto/comment.proto',
        url: (process.env.COMMENT_BACKEND_HOST || 'localhost') + ':50052',
      },
    },
  );
  app.listen();
}
bootstrap();

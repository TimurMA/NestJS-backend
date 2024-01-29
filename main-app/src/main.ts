import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = process.env.MAIN_BACKEND_HOST || 'localhost';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: './proto/user.proto',
      url: host + ':50051',
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: './proto/auth.proto',
      url: host + ':50050',
    },
  });

  await app.startAllMicroservices();
}
bootstrap();

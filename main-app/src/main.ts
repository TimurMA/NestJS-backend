import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';

config({ path: '../.env' });

const host: string = process.env.MAIN_HOST ?? 'localhost';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'users',
      protoPath: './proto/userService.proto',
      url: host + ':50001',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();

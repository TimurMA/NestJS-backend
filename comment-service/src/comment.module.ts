import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { DatabaseModule } from './database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './model/entity/comment.entity';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

config({ path: '../.env' });

const host: string = process.env.MAIN_HOST ?? 'localhost';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: './proto/userService.proto',
          url: host + ':50001',
        },
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, JwtService],
})
export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('/*');
  }
}

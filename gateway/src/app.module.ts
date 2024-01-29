import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [CommentModule, UserModule, AuthModule],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('api/auth/(.*)').forRoutes('*');
  }
}

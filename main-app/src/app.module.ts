import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from './middlewares/jwt.middleware';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/api/auth/register', method: RequestMethod.POST },
        { path: '/api/auth/login', method: RequestMethod.POST },
      )
      .forRoutes('/*');
  }
}

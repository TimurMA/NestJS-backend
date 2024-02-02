import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { config } from 'dotenv';

config({ path: '../.path' });

@Module({
  imports: [
    CommentModule,
    UserModule,
    AuthModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET ?? 'JWT_SECRET',
        signOptions: { expiresIn: '12h' },
      }),
    }),
  ],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).exclude('api/auth/(.*)').forRoutes('*');
  }
}

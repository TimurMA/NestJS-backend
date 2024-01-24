import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { config } from 'dotenv';

config({ path: '../.env' });

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeaders(req.headers);

    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? 'JWT_SECRET',
      });
      req['user'] = user;
      next();
    } catch {
      throw new HttpException('Ошибка доступа', 403);
    }
  }

  private extractTokenFromHeaders(headers: any): string | null {
    const authorizationHeader = headers['authorization'];

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.slice(7);
      return token;
    }
  }
}

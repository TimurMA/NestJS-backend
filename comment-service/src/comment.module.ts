import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './model/entity/comment.entity';
import { JwtService } from '@nestjs/jwt';
import { User } from 'user/library';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User]), DatabaseModule],
  controllers: [CommentController],
  providers: [CommentService, JwtService],
})
export class CommentModule {}

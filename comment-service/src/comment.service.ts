import { Injectable } from '@nestjs/common';
import { Comment } from './model/entity/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommentResponse,
  CommentsResponse,
  CreateCommentRequest,
  DeleteCommentRequest,
  Response,
  UpdateCommentRequest,
} from './comment';
import { RpcException } from '@nestjs/microservices';
import { Logger } from 'testcontainers/build/common';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private readonly log = new Logger('CommentService');

  async getCommentsByUserId(userId: string): Promise<CommentsResponse> {
    const [comments, user] = await Promise.all([
      this.commentRepository.findBy({
        userId,
      }),
      this.commentRepository.query('SELECT * FROM "user" WHERE id = $1', [
        userId,
      ]),
    ]);

    return {
      comments: comments.map((comment) => {
        const commentResponse: CommentResponse = {
          comment: comment.comment,
          id: comment.id,
          user: user[0],
        };
        return commentResponse;
      }),
    };
  }

  async createComment(commentDto: CreateCommentRequest) {
    try {
      const commentToSave = new Comment();
      commentToSave.comment = commentDto.comment;
      commentToSave.userId = commentDto.userId;

      const [savedComment, user] = await Promise.all([
        this.commentRepository.save(commentToSave),
        this.commentRepository.query('SELECT * FROM "user" WHERE id = $1', [
          commentDto.userId,
        ]),
      ]);

      return {
        comment: savedComment.comment,
        id: savedComment.id,
        user: user[0],
      };
    } catch (error) {
      const response: Response = {
        message: error.message,
        statusCode: 500,
      };
      this.log.error(error);
      throw new RpcException(response);
    }
  }

  async updateCommentByCommentId(
    comment: UpdateCommentRequest,
  ): Promise<CommentResponse> {
    try {
      const commentToUpdate: Comment = await this.commentRepository.findOneBy({
        id: comment.id,
      });

      if (!commentToUpdate || commentToUpdate.userId != comment.userId) {
        throw new RpcException('Update is not successful');
      }

      commentToUpdate.comment = comment.comment;

      const [savedComment, user] = await Promise.all([
        this.commentRepository.save(commentToUpdate),
        this.commentRepository.query('SELECT * FROM "user" WHERE id = $1', [
          commentToUpdate.userId,
        ]),
      ]);

      return {
        comment: savedComment.comment,
        id: savedComment.id,
        user: user[0],
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({ message: error.message, code: 3 });
    }
  }

  async deleteCommentById(
    commentToDelete: DeleteCommentRequest,
  ): Promise<void> {
    const comment = await this.commentRepository.findOneBy({
      id: commentToDelete.id,
    });

    if (!comment || comment.userId != commentToDelete.userId) {
      const response: Response = {
        message: 'Deleting is not successful',
        statusCode: 500,
      };
      throw new RpcException(response);
    }

    await this.commentRepository.delete({ id: commentToDelete.id });
  }
}

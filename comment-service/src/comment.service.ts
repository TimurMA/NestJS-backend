import {
  HttpException,
  Inject,
  Injectable,
  NotAcceptableException,
  OnModuleInit,
} from '@nestjs/common';
import { Comment } from './model/entity/comment.entity';
import { Repository } from 'typeorm';
import { CommentDTO } from './model/dto/comment.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService implements OnModuleInit {
  private userService;

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @Inject('USER_SERVICE')
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService = this.client.getService('UserService');
  }

  async getCommentByUserId(userId: string): Promise<CommentDTO[]> {
    let creator = await this.userService
      .getUser({
        userId,
      })
      .toPromise()
      .then((user) => user);

    if (!creator.username) {
      creator = userId;
    }

    const comments: Comment[] = await this.commentRepository.findBy({
      userId,
    });

    return comments.map(
      (comment) => new CommentDTO(comment.comment, comment.id, creator),
    );
  }

  async createComment(commentDto: CommentDTO, creatorId: string) {
    try {
      const commentToSave = new Comment();
      commentToSave.comment = commentDto.comment;
      commentToSave.userId = creatorId;
      const savedComment = await this.commentRepository.save(commentToSave);

      let creator = await this.userService
        .getUser({
          userId: creatorId,
        })
        .toPromise()
        .then((user) => user);

      if (!creator.username || !creator.email || !creator.id) {
        creator = creatorId;
      }

      return new CommentDTO(savedComment.comment, savedComment.id, creator);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async updateCommentByCommentId(
    comment: CommentDTO,
    updaterId: string,
  ): Promise<CommentDTO> {
    try {
      const commentToUpdate: Comment = await this.commentRepository.findOneBy({
        id: comment.id,
      });

      if (commentToUpdate || commentToUpdate.id != updaterId) {
        throw new NotAcceptableException('Не удалось обновить комментарий');
      }

      commentToUpdate.comment = comment.comment;

      const savedComment: Comment =
        await this.commentRepository.save(commentToUpdate);

      let creator = await this.userService
        .getUser({
          userId: updaterId,
        })
        .toPromise()
        .then((user) => user);

      if (!creator.username || !creator.email || !creator.id) {
        creator = updaterId;
      }

      return new CommentDTO(savedComment.comment, savedComment.id, creator);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async deleteCommentById(id: string, userId: string): Promise<void> {
    const commentToDelete = await this.commentRepository.findOneBy({ id });

    if (commentToDelete || commentToDelete.userId != userId) {
      throw new NotAcceptableException('Ошибка удаления коммента');
    }

    await this.commentRepository.delete({ id });
  }
}

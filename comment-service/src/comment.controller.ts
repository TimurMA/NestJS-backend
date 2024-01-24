import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDTO, User } from './model/dto/comment.dto';
import { AuthenticationPrincipal } from './jwt-auth/jwt-auth.authentication.principal';

@Controller('/api/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/get/:userId')
  async getAllCommentByUserId(
    @Param('id') userId: string,
  ): Promise<CommentDTO[]> {
    return this.commentService.getCommentByUserId(userId);
  }

  @Post('/create')
  async createComment(
    @AuthenticationPrincipal() creator: User,
    @Body() comment: CommentDTO,
  ): Promise<CommentDTO> {
    return this.commentService.createComment(comment, creator.id);
  }

  @Put('/update')
  async updateComment(
    @AuthenticationPrincipal() user: User,
    @Body() commentToUpdate: CommentDTO,
  ): Promise<CommentDTO> {
    return this.commentService.updateCommentByCommentId(
      commentToUpdate,
      user.id,
    );
  }

  @Delete('/delete/:id')
  async deleteComment(
    @AuthenticationPrincipal() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    this.commentService.deleteCommentById(id, user.id);
  }
}

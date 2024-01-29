import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  CommentResponse,
  CommentServiceController,
  CommentServiceControllerMethods,
  CommentsResponse,
  CreateCommentRequest,
  DeleteCommentRequest,
  GetUserCommentsRequest,
  Response,
  UpdateCommentRequest,
} from './comment';
import { Observable, from } from 'rxjs';

@Controller('/api/comment')
@CommentServiceControllerMethods()
export class CommentController implements CommentServiceController {
  constructor(private readonly commentService: CommentService) {}

  getCommentsByUserId(
    request: GetUserCommentsRequest,
  ): Observable<CommentsResponse> {
    return from(this.commentService.getCommentsByUserId(request.userId));
  }

  createComment(comment: CreateCommentRequest): Promise<CommentResponse> {
    return this.commentService.createComment(comment);
  }

  updateComment(
    commentToUpdate: UpdateCommentRequest,
  ): Promise<CommentResponse> {
    return this.commentService.updateCommentByCommentId(commentToUpdate);
  }

  async deleteComment(
    commentToDelete: DeleteCommentRequest,
  ): Promise<Response> {
    await this.commentService.deleteCommentById(commentToDelete);
    return {
      message: 'Успешное удаление комментария',
      statusCode: 200,
    };
  }
}

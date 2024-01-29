import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import {
  COMMENT_PACKAGE_NAME,
  COMMENT_SERVICE_NAME,
  CommentResponse,
  CommentServiceClient,
  CreateCommentRequest,
  DeleteCommentRequest,
  Response,
  UpdateCommentRequest,
  UserDTO,
} from './comment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthenticationPrincipal } from 'src/utils/jwt-auth/jwt-auth.authentication.principal';

@Controller('/api/comment')
export class CommentController implements OnModuleInit {
  private commentService: CommentServiceClient;
  constructor(
    @Inject(COMMENT_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.commentService =
      this.client.getService<CommentServiceClient>(COMMENT_SERVICE_NAME);
  }

  @Get('/all/:userId')
  getUserComments(
    @Param('userId') userId: string,
  ): Observable<CommentResponse[] | Response> {
    return this.commentService.getCommentsByUserId({ userId }).pipe(
      map((commentsResponse) => commentsResponse.comments ?? []),
      catchError((error) => throwError(() => new RpcException(error))),
    );
  }

  @Post('/create')
  createComment(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() comment: CreateCommentRequest,
  ): Observable<CommentResponse | Response> {
    comment.userId = currentUser.id;
    return this.commentService
      .createComment(comment)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Patch('/update')
  updateComment(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Body() commentToUpdate: UpdateCommentRequest,
  ): Observable<CommentResponse | Response> {
    commentToUpdate.userId = currentUser.id;
    return this.commentService
      .updateComment(commentToUpdate)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }

  @Delete('/delete/:id')
  deleteComment(
    @AuthenticationPrincipal() currentUser: UserDTO,
    @Param('id') id: string,
  ): Observable<Response> {
    const commentToDelete: DeleteCommentRequest = {
      id,
      userId: currentUser.id,
    };
    return this.commentService
      .deleteComment(commentToDelete)
      .pipe(catchError((error) => throwError(() => new RpcException(error))));
  }
}

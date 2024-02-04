/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';

export const protobufPackage = 'comment';

export class Response {
  @ApiProperty()
  message: string;
  @ApiProperty()
  statusCode: number;
}

export class UserDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: string;
}

export class CommentResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  user: UserDTO | undefined;
}

export class CommentsResponse {
  @ApiProperty()
  comments: CommentResponse[];
}

export class GetUserCommentsRequest {
  @ApiProperty()
  userId: string;
}

export class CreateCommentRequest {
  @ApiProperty()
  comment: string;
  @ApiProperty()
  userId: string;
}

export class DeleteCommentRequest {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
}

export class UpdateCommentRequest {
  @ApiProperty()
  id: string;
  @ApiProperty()
  comment: string;
  @ApiProperty()
  userId?: string;
}

export const COMMENT_PACKAGE_NAME = 'comment';

export interface CommentServiceClient {
  getCommentsByUserId(
    request: GetUserCommentsRequest,
  ): Observable<CommentsResponse>;

  createComment(request: CreateCommentRequest): Observable<CommentResponse>;

  updateComment(request: UpdateCommentRequest): Observable<CommentResponse>;

  deleteComment(request: DeleteCommentRequest): Observable<Response>;
}

export const COMMENT_SERVICE_NAME = 'CommentService';

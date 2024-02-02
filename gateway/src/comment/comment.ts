/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

export const protobufPackage = 'comment';

export interface Response {
  message: string;
  statusCode: number;
}

export interface CommentResponse {
  id: string;
  comment: string;
  user: UserDTO | undefined;
}

export interface CommentsResponse {
  comments: CommentResponse[];
}

export interface GetUserCommentsRequest {
  userId: string;
}

export interface CreateCommentRequest {
  comment: string;
  userId: string;
}

export interface DeleteCommentRequest {
  id: string;
  userId: string;
}

export interface UpdateCommentRequest {
  id: string;
  comment: string;
  userId?: string;
}

export interface UserDTO {
  username: string;
  email: string;
  id: string;
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

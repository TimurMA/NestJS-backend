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
  userId: string;
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

export interface CommentServiceController {
  getCommentsByUserId(
    request: GetUserCommentsRequest,
  ): Observable<CommentsResponse>;

  createComment(
    request: CreateCommentRequest,
  ): Promise<CommentResponse> | Observable<CommentResponse> | CommentResponse;

  updateComment(
    request: UpdateCommentRequest,
  ): Promise<CommentResponse> | Observable<CommentResponse> | CommentResponse;

  deleteComment(
    request: DeleteCommentRequest,
  ): Promise<Response> | Observable<Response> | Response;
}

export function CommentServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createComment',
      'updateComment',
      'deleteComment',
      'getCommentsByUserId',
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('CommentService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('CommentService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
}

export const COMMENT_SERVICE_NAME = 'CommentService';

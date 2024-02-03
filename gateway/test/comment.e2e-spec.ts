import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

import { AuthenticationResponse, RegisterRequest } from '../src/auth/auth';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../src/comment/comment';

describe('CommentController', () => {
  let app: INestApplication;
  let commenter: AuthenticationResponse;
  let watcher: AuthenticationResponse;

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<AuthenticationResponse> => {
    const registerRequest: RegisterRequest = {
      username,
      email,
      password,
    };

    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send(registerRequest)
      .expect(201)
      .expect((response) => {
        expect(response.body.token).toBeDefined();
        expect(response.body.username).toBeDefined();
        expect(response.body.email).toBeDefined();
        expect(response.body.id).toBeDefined();
      })
      .then((response) => response.body);
  };

  const createCommentByCommenter = async (
    comment: string,
  ): Promise<CommentResponse> => {
    const commentToCreate: CreateCommentRequest = {
      userId: commenter.id,
      comment: comment,
    };

    return request(app.getHttpServer())
      .post('/api/comment/create')
      .set('Authorization', `Bearer ${commenter.token}`)
      .send(commentToCreate)
      .expect(201)
      .expect((response) => {
        expect(response.body.id).toBeDefined();
        expect(response.body.comment).toBeDefined();
        expect(response.body.user.id).toBeDefined();
      })
      .then((response) => response.body);
  };

  const updateComment = (
    comment: string,
    id: string,
    token: string,
  ): request.Test => {
    const updateCommentRequest: UpdateCommentRequest = {
      id,
      comment,
    };

    return request(app.getHttpServer())
      .patch('/api/comment/update')
      .set('Authorization', `Bearer ${token}`)
      .send(updateCommentRequest);
  };

  const deleteCommentById = (id: string, token: string): request.Test =>
    request(app.getHttpServer())
      .delete(`/api/comment/delete/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();

  const getAllCommentByCommenter = async (): Promise<CommentResponse[]> =>
    request(app.getHttpServer())
      .get(`/api/comment/all/${commenter.id}`)
      .set('Authorization', `Bearer ${commenter.token}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toBeInstanceOf(Array);
      })
      .then((response) => response.body);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    commenter = await register(
      'commenter',
      'comenter@commenter.domen',
      'commenter',
    );
    watcher = await register('watcher', 'watcher@watcher.domen', 'watchers');
  });

  afterAll(async () => {
    await app.close();
  });

  test('create comment', async () => {
    const commentResponse: CommentResponse =
      await createCommentByCommenter('commentToCreate');

    const commenterComments: CommentResponse[] =
      await getAllCommentByCommenter();

    expect(
      commenterComments.find(
        (comment) =>
          comment.id === commentResponse.id &&
          comment.comment === commentResponse.comment &&
          comment.user.id === commenter.id,
      ),
    ).toBeDefined();
  });

  test('comment is being updated by owner', async () => {
    const commentResponse: CommentResponse =
      await createCommentByCommenter('commentToUpdate');

    const updatedComment: CommentResponse = await updateComment(
      'updatedComment',
      commentResponse.id,
      commenter.token,
    )
      .expect(200)
      .expect((response) => {
        expect(response.body.comment).not.toEqual(commentResponse.comment);
        expect(response.body.comment).toEqual('updatedComment');
        expect(response.body.id).toBeDefined();
        expect(response.body.user).toBeDefined();
      })
      .then((response) => response.body);

    const commenterComments: CommentResponse[] =
      await getAllCommentByCommenter();

    expect(
      commenterComments.find(
        (comment) =>
          comment.comment === updatedComment.comment &&
          comment.id === commentResponse.id &&
          comment.user.id === commenter.id,
      ),
    ).toBeDefined();

    expect(
      commenterComments.find(
        (comment) =>
          comment.comment === commentResponse.comment &&
          comment.id === commentResponse.id &&
          comment.user.id === commenter.id,
      ),
    ).toBeUndefined();
  });

  test('comment is being updated by not owner', async () => {
    const commentResponse: CommentResponse =
      await createCommentByCommenter('commentToUpdate');

    await updateComment(
      'updatedCommentByNotOwner',
      commentResponse.id,
      watcher.token,
    ).expect(500);

    const commenterComments: CommentResponse[] =
      await getAllCommentByCommenter();

    expect(
      commenterComments.find(
        (comment) =>
          comment.comment === comment.comment &&
          comment.id === commentResponse.id &&
          comment.user.id,
      ),
    ).toBeDefined();

    expect(
      commenterComments.find(
        (comment) =>
          comment.comment === 'updatedCommentByNotOwner' &&
          comment.id === commentResponse.id &&
          comment.user.id,
      ),
    ).toBeUndefined();
  });

  test('comment is being deleted by owner', async () => {
    const commentResponse: CommentResponse =
      await createCommentByCommenter('commentToDelete');

    await deleteCommentById(commentResponse.id, commenter.token)
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toEqual('Успешное удаление комментария');
        expect(response.body.statusCode).toEqual(200);
      });

    const commenterComments = await getAllCommentByCommenter();

    expect(
      commenterComments.find((comment) => comment.id === commentResponse.id),
    ).toBeUndefined();
  });

  test('comment is being deleted by not owner', async () => {
    const commentResponse: CommentResponse =
      await createCommentByCommenter('commentToDelete');

    await deleteCommentById(commentResponse.id, watcher.token).expect(500);

    const commenterComments = await getAllCommentByCommenter();

    expect(
      commenterComments.find((comment) => comment.id === commentResponse.id),
    ).toBeDefined();
  });
});

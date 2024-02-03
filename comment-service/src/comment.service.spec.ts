import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { config } from 'dotenv';
import { Comment } from './model/entity/comment.entity';
import {
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  UserDTO,
} from './comment';
import { CommentModule } from './comment.module';

config({ path: '../.env' });

describe('CommentService', () => {
  let app: TestingModule;
  let user: UserDTO;
  let commentService: CommentService;
  let commentRepository: Repository<Comment>;

  const saveComment = async (
    comment: string,
    userId: string,
  ): Promise<CommentResponse> => {
    const commentToSave: CreateCommentRequest = {
      comment: comment,
      userId: userId,
    };
    const savedComment: CommentResponse =
      await commentService.createComment(commentToSave);

    expect(savedComment).toMatchObject({
      comment: commentToSave.comment,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      id: expect.anything(),
    });

    return savedComment;
  };

  beforeAll(async () => {
    const commentRepositoryToken = getRepositoryToken(Comment);

    app = await Test.createTestingModule({
      imports: [CommentModule],
    }).compile();

    commentService = app.get<CommentService>(CommentService);
    commentRepository = app.get<Repository<Comment>>(commentRepositoryToken);

    expect(commentService).toBeDefined();
    expect(commentRepository).toBeDefined();

    await commentRepository.query(
      'INSERT INTO "user" ("id", "email", "username", "password") ' +
        "VALUES ('ideshnik', 'testEmail@test.su', 'testUsername', 'test1234');",
    );

    user = {
      id: 'ideshnik',
      username: 'testUsername',
      email: 'testEmail@test.su',
    };
  }, 20000);

  afterAll(async () => {
    await app.close();
  });

  test('comment saving', async () => {
    const savedComment = await saveComment('comment test1', user.id);
    const commentFromDb: Comment = await commentRepository.findOneBy({
      id: savedComment.id,
    });

    expect(commentFromDb).not.toBeNull();

    expect(commentFromDb.comment).toEqual(savedComment.comment);
    expect(commentFromDb.userId).toEqual(savedComment.user.id);
  });

  test('test get user comments', async () => {
    const [first, second, third] = await Promise.all([
      saveComment('firstGet', user.id),
      saveComment('secondGet', user.id),
      saveComment('thirdGet', user.id),
    ]);

    const userComments: CommentResponse[] = await commentService
      .getCommentsByUserId(user.id)
      .then((commentsResponse) => commentsResponse.comments);

    expect(
      userComments.findIndex(
        (comment) =>
          comment.comment === first.comment &&
          comment.user.id === first.user.id,
      ),
    ).not.toEqual(-1);
    expect(
      userComments.findIndex(
        (comment) =>
          comment.comment === second.comment &&
          comment.user.id === second.user.id,
      ),
    ).not.toEqual(-1);
    expect(
      userComments.findIndex(
        (comment) =>
          comment.comment === third.comment &&
          comment.user.id === third.user.id,
      ),
    ).not.toEqual(-1);
  });

  test('test comment update', async () => {
    const savedComment = await saveComment('comment to update', user.id);

    const updateComment: UpdateCommentRequest = {
      id: savedComment.id,
      comment: 'updated comment',
      userId: user.id,
    };

    const response: CommentResponse =
      await commentService.updateCommentByCommentId(updateComment);

    expect(response).toMatchObject({
      comment: updateComment.comment,
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
      id: savedComment.id,
    });

    const updatedComment: Comment = await commentRepository.findOneBy({
      id: savedComment.id,
    });

    expect(updatedComment.comment).not.toEqual(savedComment.comment);
    expect(updatedComment.comment).toEqual(response.comment);
    expect(updatedComment.userId).toEqual(savedComment.user.id);
  });

  test('test delete comment', async () => {
    const savedComment = await saveComment('comment to update', user.id);

    await commentService.deleteCommentById({
      userId: user.id,
      id: savedComment.id,
    });

    const checkComment = await commentRepository.findOneBy({
      id: savedComment.id,
    });

    expect(checkComment).toBeNull;
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { execSync } from 'child_process';

describe('AppController (e2e)', () => {
  const logger: Logger = new Logger('TestMainApp');

  let app: INestApplication;

  let token: string;

  beforeAll(async () => {
    execSync(
      'docker compose -f docker-compose-test.yml up -d -p testing_main_app --build --abort-on-container-exit',
    );
    logger.warn('Mock DB is ready to work');
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger.warn('App is started');

    token = (
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: 'test1',
          email: 'test1@gmail.su',
          password: '12345',
        })
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.username).toBeDefined();
          expect(res.body.email).toBeDefined();
          expect(res.body.token).toBeDefined();
        })
        .expect(201)
    ).body.token;
    logger.debug(token);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    logger.warn('App is closed');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    execSync('docker compose -f docker-compose-test.yml down -v');
    logger.warn('Mock DB is closed');
  });

  test('should successfully register a user', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: 'test1',
        email: 'test1@gmail.su',
        password: '12345',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.token).toBeDefined();
      });
  });

  test('should successfully log in a user', async () => {
    await request(app.getHttpServer)
      .post('/api/auth/login')
      .send({
        username: 'test1',
        password: '12345',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBeDefined();
        expect(res.body.email).toBeDefined();
        expect(res.body.token).toBeDefined();
      });
  });
});

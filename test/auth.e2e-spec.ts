import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { ALREADY_EXIST_ERROR, USER_NOT_FOUNT_ERROR } from '../src/auth/atuh.constants';

const testDto: AuthDto = {
  login: 'test',
  password: '123456',

};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userID: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('/auth/register (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        userID = body._id;
        expect(userID).toBeDefined();
      });
  });
  it('/auth/register (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testDto)
      .expect(400, {
        statusCode: 400,
        message: ALREADY_EXIST_ERROR,
        error: 'Bad Request',
      });
  });

  it('/auth', async () => {
    return request(app.getHttpServer())
      .get('/auth')
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length > 0);
      });
  });

  it('/auth/:id (DELETE) - success', async () => {
    return request(app.getHttpServer())
      .delete('/auth/' + userID)
      .expect(200);
  });

  it('/auth/:id (DELETE) - fail', async () => {
    return request(app.getHttpServer())
      .delete('/auth/62b3143a270c263f4bb8b2c8')
      .expect(404, {
        statusCode: 404,
        message: USER_NOT_FOUNT_ERROR,
      });
  });

  afterAll(() => {
    disconnect();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUNT } from '../src/review/review.consts';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();
const testDto: CreateReviewDto = {
  name: 'test',
  title: 'some title',
  description: 'some Description',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: "nestCourse",
  password: "123456"
}
let token: string

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const {body} = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
    token = body.access_token
  });
  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .set('Authorization', 'Bearer ' + token)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/review/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', 'Bearer' + token)
      .send({...testDto, rating: 0})
      .expect(400)
  });

  it('review/byProduct (GET - success)',  async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
          expect(body.length).toBe(1);
      });
  });
  it('review/byProduct (GET - fail)',  async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.length).toBe(0);
      });
  });
  it('/review/delete (DELETE) - fail',  () => {
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUNT
      })
  })

  it('/review/delete (DELETE) - success',  () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  afterAll(() => {
    disconnect();
  });
});

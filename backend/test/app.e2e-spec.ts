import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (POST) - should return 401 for invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'invalid', password: 'invalid' })
      .expect(401);
  });

  it('/api/products (GET) - should return products list', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(200)
      .then((response) => {
        expect(response.body.items).toBeDefined();
      });
  });

  it('/api/categories (GET) - should return categories list', () => {
    return request(app.getHttpServer())
      .get('/api/categories')
      .expect(200)
      .then((response) => {
        expect(response.body.items).toBeDefined();
      });
  });

  it('/api/health (GET) - should return health status', () => {
    return request(app.getHttpServer()).get('/api/health').expect(200);
  });
});

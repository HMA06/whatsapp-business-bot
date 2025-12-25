import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/user.entity';

describe('Users API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [User],
            synchronize: true,
          }),
          AppModule,
        ],
      }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/users', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/users', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/users')
      .send({ email: 'e2e@test.com', role: 'admin' })
      .expect(201);

    expect(res.body.email).toBe('e2e@test.com');
  });

  it('PATCH /api/users/:id/role', async () => {
    const create = await request(app.getHttpServer())
      .post('/api/users')
      .send({ email: 'patch@test.com', role: 'admin' });

    const res = await request(app.getHttpServer())
      .patch(`/api/users/${create.body.id}/role`)
      .send({ role: 'user' })
      .expect(200);

    expect(res.body.role).toBe('user');
  });
});

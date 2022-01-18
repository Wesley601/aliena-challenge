import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundExceptionFilter } from '../src/Filters/not-fond.filter';
import { ActorsModule } from '../src/actors/actors.module';
import { Actor } from '../src/actors/entities/actor.entity';

describe('ActorsController (e2e)', () => {
  let app: INestApplication;

  const mockMovieRepository = {
    save: jest.fn((dto) => dto),
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ActorsModule],
    })
      .overrideProvider(getRepositoryToken(Actor))
      .useValue(mockMovieRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new NotFoundExceptionFilter());
    await app.init();
  });

  describe('/actors (POST)', () => {
    it('should return 201 if has a correct payload', () => {
      return request(app.getHttpServer())
        .post('/actors')
        .send({
          name: 'any name',
          birthDate: '2018-05-23',
        })
        .expect(201);
    });

    it('should create new actor if has a correct payload', async () => {
      const body = {
        name: 'any name',
        birthDate: '2018-05-23',
      };

      const response = await request(app.getHttpServer())
        .post('/actors')
        .send(body);

      return expect(response.body).toEqual({
        id: expect.any(Number),
        ...body,
      });
    });

    it('should return 400 if do not pass the birth date in ISO8601 format', () => {
      const body = {
        name: 'any actor',
        releaseDate: '23-05-2018',
      };

      return request(app.getHttpServer())
        .post('/actors')
        .send(body)
        .expect(400);
    });

    it('should return 400 if do not pass the actor name', () => {
      const body = {
        releaseDate: '2018-05-23',
      };

      return request(app.getHttpServer())
        .post('/actors')
        .send(body)
        .expect(400);
    });
  });
});

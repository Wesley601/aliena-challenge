import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from '../src/movies/movies.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../src/movies/entities/movie.entity';
import { EntityNotFoundError } from 'typeorm';

describe('MovieController (e2e)', () => {
  let app: INestApplication;

  const mockMovieRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    findOneOrFail: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MoviesModule],
    })
      .overrideProvider(getRepositoryToken(Movie))
      .useValue(mockMovieRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  describe('/movies (POST)', () => {
    it('should return 201 if has a correct payload', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'any movie',
          releaseDate: '2018-05-23',
          resume: 'any resume',
        })
        .expect(201);
    });

    it('should create new movie if has a correct payload', async () => {
      const body = {
        title: 'any movie',
        releaseDate: '2018-05-23',
        resume: 'any resume',
      };

      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(body);

      return expect(response.body).toEqual({
        id: expect.any(Number),
        ...body,
      });
    });

    it('should create new movie without the movie resume', async () => {
      const body = {
        title: 'any movie',
        releaseDate: '2018-05-23',
      };

      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(body);

      return expect(response.body).toEqual({
        id: expect.any(Number),
        ...body,
      });
    });

    it('should return 400 if do not pass the release date in ISO8601 format', () => {
      const body = {
        title: 'any movie',
        releaseDate: '23-05-2018',
        resume: 'any resume',
      };

      return request(app.getHttpServer())
        .post('/movies')
        .send(body)
        .expect(400);
    });
    it('should return 400 if do not pass the movie title', () => {
      const body = {
        releaseDate: '23-05-2018',
        resume: 'any resume',
      };

      return request(app.getHttpServer())
        .post('/movies')
        .send(body)
        .expect(400);
    });
  });

  describe('/movies/:id (PATCH)', () => {
    it('should return 200 if has a correct payload', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({
          title: 'any movie',
          releaseDate: '2018-05-23',
          resume: 'any resume',
        })
        .expect(200);
    });

    it('should update a movie if has a correct payload', async () => {
      const body = {
        title: 'any movie',
        releaseDate: '2018-05-23',
        resume: 'any resume',
      };

      const response = await request(app.getHttpServer())
        .patch('/movies/1')
        .send(body);

      return expect(response.body).toEqual({
        id: 1,
        ...body,
      });
    });

    it('should return 400 if do not pass the release date in ISO8601 format', () => {
      const body = {
        releaseDate: '23-05-2018',
      };

      return request(app.getHttpServer())
        .patch('/movies/1')
        .send(body)
        .expect(400);
    });

    it('should return 404 if the movie was not found', () => {
      const body = {
        releaseDate: '23-05-2018',
        resume: 'any resume',
      };

      jest
        .spyOn(mockMovieRepository, 'findOneOrFail')
        .mockRejectedValueOnce(
          new EntityNotFoundError({ type: new Movie(), name: 'Movie' }, null),
        );

      return request(app.getHttpServer())
        .patch('/movies/2')
        .send(body)
        .expect(404);
    });
  });
});

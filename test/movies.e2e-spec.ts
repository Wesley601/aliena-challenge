import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MoviesModule } from '../src/movies/movies.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../src/movies/entities/movie.entity';
import { EntityNotFoundError } from 'typeorm';
import { NotFoundExceptionFilter } from '../src/Filters/not-fond.filter';

describe('MovieController (e2e)', () => {
  let app: INestApplication;

  const movies = [
    new Movie({
      id: 1,
      title: 'Brilho eterno de uma mente sem lembranças',
      releaseDate: '2004-07-23',
    }),
    new Movie({ id: 2, title: 'bee movie', releaseDate: '2007-12-07' }),
    new Movie({ id: 3, title: 'O Farol', releaseDate: '2020-01-02' }),
  ];

  const mockMovieRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    findOneOrFail: jest.fn((id) =>
      Promise.resolve(movies.find((movie) => movie.id == id)),
    ),
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
    app.useGlobalFilters(new NotFoundExceptionFilter());
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
        releaseDate: '2018-05-23',
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

  describe('/movies/:id (GET)', () => {
    it('should return 200 if has found a movie', () => {
      return request(app.getHttpServer()).get('/movies/1').expect(200);
    });

    it('should return a movie if has founded', async () => {
      const response = await request(app.getHttpServer()).patch('/movies/1');
      return expect(response.body).toEqual(movies[0]);
    });

    it('should return 404 if the movie was not found', () => {
      jest
        .spyOn(mockMovieRepository, 'findOneOrFail')
        .mockRejectedValueOnce(
          new EntityNotFoundError({ type: new Movie(), name: 'Movie' }, null),
        );
      return request(app.getHttpServer()).get('/movies/22').expect(404);
    });
  });
});
